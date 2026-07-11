import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Noticia } from "@/lib/pipeline/types";

const CATEGORIA_CORES: Record<string, string> = {
  Técnica: "bg-blue-100 text-blue-800",
  Institucional: "bg-purple-100 text-purple-800",
  Acidentes: "bg-red-100 text-red-800",
  Normas: "bg-amber-100 text-amber-800",
  Treinamentos: "bg-green-100 text-green-800",
  Mercado: "bg-teal-100 text-teal-800",
};

const SITUACAO_ICONE: Record<string, string> = {
  Confirmada: "✓",
  "Parcialmente confirmada": "~",
  "Em apuração": "?",
};

const ESTRELAS = ["", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

export function NoticiaCard({ noticia, index }: { noticia: Noticia; index: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug">
            <span className="text-zinc-400 mr-1">#{index + 1}</span>
            {noticia.titulo}
          </CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
          <Badge className={CATEGORIA_CORES[noticia.categoria] ?? "bg-zinc-100"}>
            {noticia.categoria}
          </Badge>
          <span>{ESTRELAS[noticia.relevancia]}</span>
          <span>
            {SITUACAO_ICONE[noticia.situacao]} {noticia.situacao}
          </span>
          <span className="text-zinc-400">{noticia.dataPublicacao}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {noticia.dataAcontecimento && (
          <p className="text-xs text-zinc-400">
            Data do acontecimento: {noticia.dataAcontecimento}
          </p>
        )}
        <p className="text-xs text-zinc-400">Local: {noticia.local}</p>

        <div>
          <h4 className="font-medium text-zinc-700 mb-1">Resumo</h4>
          <p className="text-zinc-600 leading-relaxed">{noticia.resumo}</p>
        </div>

        <div>
          <h4 className="font-medium text-zinc-700 mb-1">Interesse para profissionais</h4>
          <p className="text-zinc-600 leading-relaxed">{noticia.interesseProfissional}</p>
        </div>

        <div>
          <h4 className="font-medium text-zinc-700 mb-1">Ponto técnico</h4>
          <p className="text-zinc-600 leading-relaxed">{noticia.pontoTecnico}</p>
        </div>

        <div>
          <h4 className="font-medium text-zinc-700 mb-1">Fontes</h4>
          <ul className="list-disc list-inside space-y-0.5">
            {noticia.fontes.map((f, i) => (
              <li key={i}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
