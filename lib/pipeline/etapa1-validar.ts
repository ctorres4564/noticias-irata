import { PesquisaParams } from "./types";

export function validarParams(body: unknown): PesquisaParams {
  const defaults: PesquisaParams = {
    periodo: "7d",
    quantidade: 5,
    canal: "ambos",
    categorias: undefined,
  };

  if (!body || typeof body !== "object") {
    return defaults;
  }

  const b = body as Record<string, unknown>;

  if (typeof b.periodo === "string" && ["24h", "7d", "30d"].includes(b.periodo)) {
    defaults.periodo = b.periodo as "24h" | "7d" | "30d";
  }

  if (typeof b.quantidade === "number" && b.quantidade >= 3 && b.quantidade <= 20) {
    defaults.quantidade = b.quantidade;
  }

  if (typeof b.canal === "string" && ["whatsapp", "instagram", "ambos"].includes(b.canal)) {
    defaults.canal = b.canal as "whatsapp" | "instagram" | "ambos";
  }

  if (Array.isArray(b.categorias)) {
    const validas = [
      "Técnica",
      "Institucional",
      "Acidentes",
      "Normas",
      "Treinamentos",
      "Mercado",
    ];
    defaults.categorias = b.categorias.filter((c) =>
      validas.includes(c as string)
    ) as PesquisaParams["categorias"];
    if (defaults.categorias && defaults.categorias.length === 0) {
      defaults.categorias = undefined;
    }
  }

  return defaults;
}
