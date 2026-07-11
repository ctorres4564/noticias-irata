export type Categoria =
  | "Técnica"
  | "Institucional"
  | "Acidentes"
  | "Normas"
  | "Treinamentos"
  | "Mercado";

export type Canal = "whatsapp" | "instagram" | "ambos";

export type PeriodoPreset = "24h" | "7d" | "30d";

export interface PesquisaParams {
  periodo: "24h" | "7d" | "30d";
  quantidade: number;
  canal: Canal;
  categorias?: Categoria[];
}

export interface NoticiaBruta {
  titulo: string;
  url: string;
  fonte: string;
  snippet: string;
  dataPublicacao?: string;
}

export interface Noticia {
  titulo: string;
  dataAcontecimento?: string;
  dataPublicacao: string;
  local: string;
  categoria: Categoria;
  relevancia: 1 | 2 | 3 | 4 | 5;
  situacao: "Confirmada" | "Parcialmente confirmada" | "Em apuração";
  resumo: string;
  interesseProfissional: string;
  pontoTecnico: string;
  fontes: { label: string; url: string }[];
}

export interface ResumoPesquisa {
  totalEncontradas: number;
  selecionadas: number;
  descartadasForaEscopo: number;
  descartadasDuplicadas: number;
  melhorWhatsapp: { titulo: string; justificativa: string };
  melhorInstagram: { titulo: string; justificativa: string };
  noticiaAcompanhar: { titulo: string; razao: string };
  temasSemResultados: string[];
}

export interface ResultadoPesquisa {
  noticias: Noticia[];
  resumo: ResumoPesquisa;
  whatsapp?: string;
  instagram?: string;
  erro?: string;
}

export type ProgressoEtapa =
  | { etapa: "inicio" }
  | { etapa: "busca"; query: number; total: number }
  | { etapa: "extracao"; n: number; total: number }
  | { etapa: "dedup" }
  | { etapa: "classificacao" }
  | { etapa: "formatacao" }
  | { etapa: "redes" }
  | { etapa: "concluido"; resultado: ResultadoPesquisa }
  | { etapa: "erro"; mensagem: string };
