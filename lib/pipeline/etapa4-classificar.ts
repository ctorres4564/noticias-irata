import { Noticia, NoticiaBruta, PesquisaParams } from "./types";
import { callDeepseekJSON } from "@/lib/deepseek";

export async function classificarNoticias(
  noticias: NoticiaBruta[],
  params: PesquisaParams
): Promise<Noticia[]> {
  const systemPrompt = `Você é um especialista em acesso por cordas e segurança em altura.
Sua tarefa é classificar e enriquecer notícias brutas sobre IRATA, acesso por cordas e trabalho em altura.

REGRAS OBRIGATÓRIAS:
1. NUNCA invente informações. Use apenas os dados fornecidos.
2. Para cada notícia, retorne um JSON com os campos especificados.
3. O resumo deve ter no máximo 100 palavras em português brasileiro.
4. O campo "situacao" deve ser "Confirmada" quando a fonte for oficial (IRATA, HSE, Petzl, SPRAT, órgãos governamentais) ou "Parcialmente confirmada" quando houver apenas uma fonte jornalística.
5. NUNCA atribua causas, responsabilidades ou falhas técnicas sem relatório oficial.
6. Se a notícia for em inglês, traduza título e resumo para português brasileiro.
7. Escolha a categoria mais específica se a notícia se encaixar em mais de uma.

CATEGORIAS:
- Técnica: equipamentos, procedimentos, estudos de caso, projetos industriais
- Institucional: comunicados da IRATA, associações, eventos, conferências
- Acidentes: incidentes, quedas, resgates, investigações
- Normas: legislação, certificação, normas técnicas, requisitos legais
- Treinamentos: cursos, certificações, recertificações, formação profissional
- Mercado: vagas, contratações, tendências, novas empresas, expansão

RELEVÂNCIA (1-5):
- 5: Altíssimo impacto para profissionais de acesso por cordas
- 4: Relevante para a maioria dos profissionais
- 3: Interessante para setores específicos
- 2: Tangencialmente relacionado
- 1: Relação fraca com acesso por cordas

Retorne APENAS um array JSON com este formato para cada notícia:
{
  "titulo": "título em português brasileiro",
  "dataAcontecimento": "data se disponível ou null",
  "dataPublicacao": "data da publicação",
  "local": "cidade, estado, país",
  "categoria": "Técnica|Institucional|Acidentes|Normas|Treinamentos|Mercado",
  "relevancia": 1-5,
  "situacao": "Confirmada|Parcialmente confirmada|Em apuração",
  "resumo": "resumo em português brasileiro, máximo 100 palavras",
  "interesseProfissional": "explicação prática para técnicos de acesso por cordas",
  "pontoTecnico": "aspecto relacionado a segurança, equipamento, planejamento ou prevenção",
  "fontes": [{"label": "nome da fonte", "url": "link direto"}]
}`;

  const userPrompt = `Classifique e formate as seguintes notícias no período "${params.periodo}":

${JSON.stringify(noticias, null, 2)}

Retorne APENAS o array JSON com as ${params.quantidade} notícias mais relevantes, ordenadas por relevância (maior primeiro). Se houver menos notícias disponíveis, retorne apenas as disponíveis.`;

  try {
    const resultado = await callDeepseekJSON<Noticia[]>(systemPrompt, userPrompt, {
      temperature: 0.2,
    });
    return resultado.slice(0, params.quantidade);
  } catch {
    return noticias.slice(0, params.quantidade).map(toFallbackNoticia);
  }
}

function toFallbackNoticia(bruta: NoticiaBruta): Noticia {
  return {
    titulo: bruta.titulo,
    dataPublicacao: bruta.dataPublicacao ?? "Data não disponível",
    local: "Não especificado",
    categoria: "Institucional",
    relevancia: 3,
    situacao: "Parcialmente confirmada",
    resumo: bruta.snippet,
    interesseProfissional: "Informação relevante para profissionais de acesso por cordas.",
    pontoTecnico: "Consulte a fonte original para detalhes técnicos.",
    fontes: [{ label: bruta.fonte, url: bruta.url }],
  };
}
