"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConteudoRedes({
  whatsapp,
  instagram,
}: {
  whatsapp?: string;
  instagram?: string;
}) {
  return (
    <div className="space-y-4">
      {whatsapp && <BlocoRede titulo="📢 WhatsApp" conteudo={whatsapp} />}
      {instagram && <BlocoRede titulo="🎯 Instagram" conteudo={instagram} />}
    </div>
  );
}

function BlocoRede({ titulo, conteudo }: { titulo: string; conteudo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(conteudo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <Card className="border-zinc-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{titulo}</CardTitle>
        <button
          onClick={copiar}
          className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 transition-colors"
        >
          {copiado ? "✓ Copiado!" : "📋 Copiar"}
        </button>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed font-sans">
          {conteudo}
        </pre>
      </CardContent>
    </Card>
  );
}
