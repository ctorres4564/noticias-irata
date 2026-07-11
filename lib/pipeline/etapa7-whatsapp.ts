import { Noticia } from "./types";
import { callDeepseek } from "@/lib/deepseek";

export async function gerarConteudoWhatsapp(noticia: Noticia): Promise<string> {
  const systemPrompt = `Você é um redator especializado em comunicação técnica para WhatsApp.
Transforme a notícia fornecida em uma publicação curta e objetiva seguindo EXATAMENTE este formato:

📢 [TÍTULO CURTO — até 60 caracteres]

[Resumo objetivo — até 80 palavras, linguagem direta, sem adjetivos]

❓ [Pergunta técnica para engajar o grupo]

🔗 [Link da fonte principal da notícia]

REGRAS:
- Use linguagem direta e técnica, sem adjetivos desnecessários.
- O título deve ser informativo, não sensacionalista.
- A pergunta deve ser relevante para profissionais de acesso por cordas.
- Use emojis apenas os especificados no formato (📢, ❓, 🔗).`;

  const userPrompt = `Notícia:
Título: ${noticia.titulo}
Resumo: ${noticia.resumo}
Ponto técnico: ${noticia.pontoTecnico}
Interesse profissional: ${noticia.interesseProfissional}
Link principal: ${noticia.fontes[0]?.url ?? ""}

Gere o conteúdo formatado para WhatsApp.`;

  try {
    return await callDeepseek(systemPrompt, userPrompt, { temperature: 0.3, maxTokens: 500 });
  } catch {
    return `📢 ${noticia.titulo.slice(0, 60)}

${noticia.resumo}

❓ Qual sua opinião sobre este tema?

🔗 ${noticia.fontes[0]?.url ?? ""}`;
  }
}
