import { NextRequest } from "next/server";
import { validarParams } from "@/lib/pipeline/etapa1-validar";
import { eliminarDuplicidades } from "@/lib/pipeline/etapa3-dedup";
import { classificarNoticias } from "@/lib/pipeline/etapa4-classificar";
import { gerarResumo } from "@/lib/pipeline/etapa6-resumo";
import { gerarConteudoWhatsapp } from "@/lib/pipeline/etapa7-whatsapp";
import { gerarConteudoInstagram } from "@/lib/pipeline/etapa8-instagram";
import { NoticiaBruta, Noticia, ProgressoEtapa } from "@/lib/pipeline/types";

function emit(controller: ReadableStreamDefaultController, data: ProgressoEtapa) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const params = validarParams(body);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        emit(controller, { etapa: "inicio" });

        const todasBrutas: NoticiaBruta[] = [];
        const queries = [
          // Português
          "IRATA acesso por cordas",
          "trabalho em altura segurança",
          "acidente em altura 2026",
          "NR 35 trabalho em altura",
          "treinamento IRATA certificação",
          // English
          "IRATA International rope access news 2026",
          "IRATA safety bulletin 2026",
          "rope access accident investigation",
          "rope access technician training certification",
          "HSE working at height fatality statistics 2026",
          "Petzl safety alert rope access harness",
          "SPRAT rope access news 2026",
          "offshore rope access inspection maintenance",
          "wind turbine rope access blade repair",
        ];

        const queriesTotal = queries.length;
        let queryAtual = 0;

        for (const q of queries) {
          queryAtual++;
          emit(controller, { etapa: "busca", query: queryAtual, total: queriesTotal });

          const { buscarSerpApi } = await import("@/lib/serpapi");
          const resultados = await buscarSerpApi(q);

          for (const r of resultados) {
            todasBrutas.push({
              titulo: r.title,
              url: r.link,
              fonte: r.source ?? new URL(r.link).hostname.replace("www.", ""),
              snippet: r.snippet ?? "",
              dataPublicacao: r.date,
            });
          }
        }

        emit(controller, { etapa: "extracao", n: todasBrutas.length, total: todasBrutas.length });

        emit(controller, { etapa: "dedup" });
        const semDuplicadas = eliminarDuplicidades(todasBrutas);
        const duplicadas = todasBrutas.length - semDuplicadas.length;

        emit(controller, { etapa: "classificacao" });
        const classificadas: Noticia[] = await classificarNoticias(semDuplicadas, params);

        emit(controller, { etapa: "formatacao" });

        const descartadas = semDuplicadas.length - classificadas.length;

        emit(controller, { etapa: "redes" });

        const resumo = await gerarResumo(
          classificadas.map((n) => ({
            titulo: n.titulo,
            categoria: n.categoria,
            relevancia: n.relevancia,
          })),
          todasBrutas.length,
          descartadas > 0 ? descartadas : 0,
          duplicadas
        );

        let whatsapp: string | undefined;
        let instagram: string | undefined;

        const melhorWhatsapp = classificadas.find(
          (n) => n.titulo === resumo.melhorWhatsapp.titulo
        ) ?? classificadas[0];

        const melhorInstagram = classificadas.find(
          (n) => n.titulo === resumo.melhorInstagram.titulo
        ) ?? classificadas[0];

        if (params.canal === "whatsapp" || params.canal === "ambos") {
          if (melhorWhatsapp) {
            whatsapp = await gerarConteudoWhatsapp(melhorWhatsapp);
          }
        }

        if (params.canal === "instagram" || params.canal === "ambos") {
          if (melhorInstagram) {
            instagram = await gerarConteudoInstagram(melhorInstagram);
          }
        }

        emit(controller, {
          etapa: "concluido",
          resultado: {
            noticias: classificadas,
            resumo,
            whatsapp,
            instagram,
          },
        });

        controller.close();
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : "Erro desconhecido na pesquisa";
        emit(controller, { etapa: "erro", mensagem });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
