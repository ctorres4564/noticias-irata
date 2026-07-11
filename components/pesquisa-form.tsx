"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Noticia, ResumoPesquisa } from "@/lib/pipeline/types";
import { NoticiaCard } from "./noticia-card";
import { ResumoGeral } from "./resumo-geral";
import { ConteudoRedes } from "./conteudo-redes";

const CATEGORIAS = [
  { value: "Técnica", label: "Técnica" },
  { value: "Institucional", label: "Institucional" },
  { value: "Acidentes", label: "Acidentes" },
  { value: "Normas", label: "Normas" },
  { value: "Treinamentos", label: "Treinamentos" },
  { value: "Mercado", label: "Mercado" },
] as const;

const PERIODOS = [
  { value: "24h", label: "Últimas 24h" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
];

const CANAIS = [
  { value: "ambos", label: "WhatsApp + Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
];

const QUANTIDADES = [3, 5, 7, 10, 15, 20];

export function PesquisaForm() {
  const [periodo, setPeriodo] = useState("30d");
  const [quantidade, setQuantidade] = useState("5");
  const [canal, setCanal] = useState("ambos");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState("");
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [resumo, setResumo] = useState<ResumoPesquisa | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | undefined>();
  const [instagram, setInstagram] = useState<string | undefined>();
  const [erro, setErro] = useState<string | null>(null);

  function toggleCategoria(cat: string) {
    setCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function pesquisar() {
    setLoading(true);
    setProgresso("Iniciando pesquisa...");
    setErro(null);
    setNoticias([]);
    setResumo(null);
    setWhatsapp(undefined);
    setInstagram(undefined);

    try {
      const res = await fetch("/api/pesquisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodo,
          quantidade: Number(quantidade),
          canal,
          categorias: categorias.length > 0 ? categorias : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream não disponível");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const linhas = buffer.split("\n");
        buffer = linhas.pop() ?? "";

        for (const linha of linhas) {
          if (!linha.startsWith("data: ")) continue;
          const data = JSON.parse(linha.slice(6));

          switch (data.etapa) {
            case "inicio":
              setProgresso("Iniciando pesquisa...");
              break;
            case "busca":
              setProgresso(`Buscando notícias (${data.query}/${data.total} buscas)...`);
              break;
            case "extracao":
              setProgresso(`Extraindo conteúdo (${data.n}/${data.total} URLs)...`);
              break;
            case "dedup":
              setProgresso("Removendo duplicidades...");
              break;
            case "classificacao":
              setProgresso("Classificando com IA...");
              break;
            case "formatacao":
              setProgresso("Formatando resultados...");
              break;
            case "redes":
              setProgresso("Gerando conteúdo para redes sociais...");
              break;
            case "concluido":
              setNoticias(data.resultado.noticias);
              setResumo(data.resultado.resumo);
              setWhatsapp(data.resultado.whatsapp);
              setInstagram(data.resultado.instagram);
              setProgresso("");
              break;
            case "erro":
              setErro(data.mensagem);
              setProgresso("");
              break;
          }
        }
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
      setProgresso("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔍 Pesquisar notícias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                {PERIODOS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantidade</label>
              <select
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                {QUANTIDADES.map((q) => (
                  <option key={q} value={q}>
                    {q} notícias
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Canal</label>
              <select
                value={canal}
                onChange={(e) => setCanal(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                {CANAIS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categorias (opcional)</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={categorias.includes(cat.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategoria(cat.value)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>

          <button
            onClick={pesquisar}
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "🔍 Pesquisando..." : "🔍 PESQUISAR"}
          </button>
        </CardContent>
      </Card>

      {progresso && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
              <span className="text-sm text-zinc-600">{progresso}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {erro && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-700">
              ⚠️ {erro}
            </p>
            <p className="text-xs text-red-500 mt-1">
              Verifique se as chaves de API estão configuradas ou tente ampliar o período de pesquisa.
            </p>
          </CardContent>
        </Card>
      )}

      {noticias.length > 0 && (
        <>
          {noticias.map((noticia, i) => (
            <NoticiaCard key={i} noticia={noticia} index={i} />
          ))}

          {resumo && <ResumoGeral resumo={resumo} />}

          <ConteudoRedes whatsapp={whatsapp} instagram={instagram} />
        </>
      )}
    </div>
  );
}
