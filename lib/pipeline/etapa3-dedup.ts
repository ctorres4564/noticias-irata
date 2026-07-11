import { NoticiaBruta } from "./types";
import { similaridadeTitulos } from "@/lib/utils";

export function eliminarDuplicidades(noticias: NoticiaBruta[]): NoticiaBruta[] {
  const urlsVistas = new Set<string>();
  const resultado: NoticiaBruta[] = [];

  for (const n of noticias) {
    if (!n.dataPublicacao) continue;
    if (urlsVistas.has(n.url)) continue;

    const duplicada = resultado.some((r) => similaridadeTitulos(r.titulo, n.titulo) > 0.85);
    if (duplicada) continue;

    urlsVistas.add(n.url);
    resultado.push(n);
  }

  return resultado;
}
