import { NoticiaBruta, PesquisaParams } from "./types";
import { buscarSerpApi } from "@/lib/serpapi";
import { extrairFonteDominio, extrairDataTexto, similaridadeTitulos } from "@/lib/utils";

const QUERIES_PT = [
  'IRATA acesso por cordas',
  'trabalho em altura segurança',
  'acidente em altura 2026',
  'NR 35 trabalho em altura',
  'treinamento IRATA certificação',
  'norma ABNT trabalho em altura',
];

const QUERIES_EN = [
  'IRATA International rope access',
  'rope access accident investigation',
  'IRATA safety bulletin 2026',
  'working at height safety HSE',
  'Petzl safety alert rope access',
  'SPRAT rope access news',
  'offshore rope access inspection',
  'wind turbine rope access',
];

export async function buscarNoticias(params: PesquisaParams): Promise<NoticiaBruta[]> {
  const queries = [...QUERIES_PT, ...QUERIES_EN];
  const resultadosPorQuery = await Promise.all(queries.map((q) => buscarSerpApi(q)));

  const brutas: NoticiaBruta[] = [];

  for (const resultados of resultadosPorQuery) {
    for (const r of resultados) {
      brutas.push({
        titulo: r.title,
        url: r.link,
        fonte: r.source ?? extrairFonteDominio(r.link),
        snippet: r.snippet ?? "",
        dataPublicacao: r.date ?? extrairDataTexto(r.snippet ?? ""),
      });
    }
  }

  const deduplicated = dedupNoticias(brutas);
  return deduplicated.slice(0, Math.max(params.quantidade * 3, 15));
}

function dedupNoticias(noticias: NoticiaBruta[]): NoticiaBruta[] {
  const urlsVistas = new Set<string>();
  const resultado: NoticiaBruta[] = [];

  for (const n of noticias) {
    if (urlsVistas.has(n.url)) continue;

    const duplicada = resultado.some((r) => similaridadeTitulos(r.titulo, n.titulo) > 0.85);
    if (duplicada) continue;

    urlsVistas.add(n.url);
    resultado.push(n);
  }

  return resultado;
}
