import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumoPesquisa } from "@/lib/pipeline/types";

export function ResumoGeral({ resumo }: { resumo: ResumoPesquisa }) {
  return (
    <Card className="border-zinc-300">
      <CardHeader>
        <CardTitle className="text-base">📊 Resumo da Pesquisa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-zinc-500">Total encontradas:</span>{" "}
            <span className="font-semibold">{resumo.totalEncontradas}</span>
          </div>
          <div>
            <span className="text-zinc-500">Selecionadas:</span>{" "}
            <span className="font-semibold">{resumo.selecionadas}</span>
          </div>
          <div>
            <span className="text-zinc-500">Descartadas (fora do escopo):</span>{" "}
            <span className="font-semibold">{resumo.descartadasForaEscopo}</span>
          </div>
          <div>
            <span className="text-zinc-500">Descartadas (duplicadas):</span>{" "}
            <span className="font-semibold">{resumo.descartadasDuplicadas}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-zinc-700">Melhor para WhatsApp</h4>
          <p className="text-zinc-600">
            {resumo.melhorWhatsapp.titulo} — {resumo.melhorWhatsapp.justificativa}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-zinc-700">Melhor para Instagram</h4>
          <p className="text-zinc-600">
            {resumo.melhorInstagram.titulo} — {resumo.melhorInstagram.justificativa}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-zinc-700">Acompanhar</h4>
          <p className="text-zinc-600">
            {resumo.noticiaAcompanhar.titulo} — {resumo.noticiaAcompanhar.razao}
          </p>
        </div>

        {resumo.temasSemResultados.length > 0 && (
          <div>
            <h4 className="font-medium text-zinc-700">Temas sem resultados</h4>
            <ul className="list-disc list-inside text-zinc-500">
              {resumo.temasSemResultados.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
