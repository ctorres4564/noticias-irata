import { Noticia } from "./types";
import { callDeepseek } from "@/lib/deepseek";

export async function gerarConteudoInstagram(noticia: Noticia): Promise<string> {
  const systemPrompt = `Você é um redator especializado em conteúdo técnico para Instagram.
Transforme a notícia fornecida em uma publicação seguindo EXATAMENTE este formato:

🎯 HOOK: [Frase de impacto — até 10 palavras]

[Legenda — entre 120 e 180 palavras, tom profissional mas acessível. Explique o fato, o contexto e por que é relevante para profissionais de acesso por cordas e segurança em altura.]

📌 Pontos técnicos:
• [Ponto 1 relacionado a segurança, equipamento ou procedimento]
• [Ponto 2 relacionado a planejamento, supervisão ou prevenção]
• [Ponto 3 relacionado a resgate, norma ou treinamento]

💬 [Pergunta final para engajar comentários — sobre experiência prática dos leitores]

#️⃣ [Até 5 hashtags específicas do setor de acesso por cordas e segurança em altura]

REGRAS:
- O hook deve ser impactante e verdadeiro, sem sensacionalismo.
- A legenda deve ser informativa e útil para o profissional.
- Os pontos técnicos devem ter substância real.
- Use emojis apenas os especificados no formato.
- Hashtags devem ser relevantes: #IRATA #AcessoPorCordas #SegurançaEmAltura #TrabalhoEmAltura #NR35`;

  const userPrompt = `Notícia:
Título: ${noticia.titulo}
Resumo: ${noticia.resumo}
Ponto técnico: ${noticia.pontoTecnico}
Interesse profissional: ${noticia.interesseProfissional}
Categoria: ${noticia.categoria}
Link: ${noticia.fontes[0]?.url ?? ""}

Gere o conteúdo formatado para Instagram.`;

  try {
    return await callDeepseek(systemPrompt, userPrompt, { temperature: 0.4, maxTokens: 800 });
  } catch {
    return `🎯 HOOK: ${noticia.titulo.slice(0, 60)}

${noticia.resumo}

📌 Pontos técnicos:
• ${noticia.pontoTecnico}
• Planejamento e supervisão são essenciais para prevenir incidentes.
• Consulte a fonte original para detalhes completos.

💬 Como este tema impacta seu trabalho em altura?

#️⃣ #IRATA #AcessoPorCordas #SegurançaEmAltura #TrabalhoEmAltura`;
  }
}
