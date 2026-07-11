import { ResumoPesquisa } from "./types";
import { callDeepseekJSON } from "@/lib/deepseek";

export async function gerarResumo(
  noticiasClassificadas: { titulo: string; categoria: string; relevancia: number }[],
  totalBrutas: number,
  descartadas: number,
  duplicadas: number
): Promise<ResumoPesquisa> {
  const systemPrompt = `Você é um editor especializado em notícias de acesso por cordas e segurança em altura.
Analise as notícias fornecidas e produza um resumo executivo em português brasileiro.
Retorne APENAS um JSON com este formato:
{
  "melhorWhatsapp": {"titulo": "título", "justificativa": "1 frase"},
  "melhorInstagram": {"titulo": "título", "justificativa": "1 frase"},
  "noticiaAcompanhar": {"titulo": "título", "razao": "1 frase"},
  "temasSemResultados": ["tema 1", "tema 2"]
}`;

  const userPrompt = `Notícias classificadas:
${JSON.stringify(noticiasClassificadas, null, 2)}

Gere o resumo executivo. A melhor para WhatsApp deve ser a de maior impacto direto no dia a dia do profissional. A melhor para Instagram deve ser a mais visual e com apelo mais amplo. A notícia a acompanhar deve ser aquela com desdobramentos futuros importantes.`;

  try {
    const ia = await callDeepseekJSON<Omit<ResumoPesquisa, "totalEncontradas" | "selecionadas" | "descartadasForaEscopo" | "descartadasDuplicadas">>(
      systemPrompt,
      userPrompt,
      { temperature: 0.3 }
    );

    return {
      totalEncontradas: totalBrutas,
      selecionadas: noticiasClassificadas.length,
      descartadasForaEscopo: descartadas,
      descartadasDuplicadas: duplicadas,
      melhorWhatsapp: ia.melhorWhatsapp,
      melhorInstagram: ia.melhorInstagram,
      noticiaAcompanhar: ia.noticiaAcompanhar,
      temasSemResultados: ia.temasSemResultados ?? [],
    };
  } catch {
    return {
      totalEncontradas: totalBrutas,
      selecionadas: noticiasClassificadas.length,
      descartadasForaEscopo: descartadas,
      descartadasDuplicadas: duplicadas,
      melhorWhatsapp: {
        titulo: noticiasClassificadas[0]?.titulo ?? "",
        justificativa: "Notícia de maior relevância identificada.",
      },
      melhorInstagram: {
        titulo: noticiasClassificadas[0]?.titulo ?? "",
        justificativa: "Conteúdo adequado para divulgação visual.",
      },
      noticiaAcompanhar: {
        titulo: noticiasClassificadas[0]?.titulo ?? "",
        razao: "Possíveis desdobramentos a monitorar.",
      },
      temasSemResultados: [],
    };
  }
}
