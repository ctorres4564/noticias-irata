import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizarTitulo(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function similaridadeTitulos(a: string, b: string): number {
  const na = normalizarTitulo(a);
  const nb = normalizarTitulo(b);

  if (na === nb) return 1;

  const palavrasA = new Set(na.split(" "));
  const palavrasB = new Set(nb.split(" "));

  let intersecao = 0;
  for (const p of palavrasA) {
    if (palavrasB.has(p)) intersecao++;
  }

  const uniao = palavrasA.size + palavrasB.size - intersecao;
  return uniao === 0 ? 0 : intersecao / uniao;
}

export function extrairDataTexto(texto: string): string | undefined {
  const match = texto.match(/(\d{2}\/\d{2}\/\d{4})/);
  return match ? match[1] : undefined;
}

export function extrairFonteDominio(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "");
  } catch {
    return url;
  }
}
