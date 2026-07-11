interface SerpApiResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  date?: string;
}

interface SerpApiResponse {
  organic_results?: SerpApiResult[];
  search_metadata?: { status: string };
}

export async function buscarSerpApi(query: string): Promise<SerpApiResult[]> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    console.warn("SERPAPI_API_KEY não configurada. Retornando dados simulados.");
    return getMockResults(query);
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    q: query,
    engine: "google",
    num: "10",
    gl: "br",
    hl: "pt",
  });

  const url = `https://serpapi.com/search.json?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.warn(`SerpAPI retornou ${res.status} para query "${query}".`);
    return [];
  }

  const data = (await res.json()) as SerpApiResponse;
  return data.organic_results ?? [];
}

function getMockResults(query: string): SerpApiResult[] {
  return [
    {
      title: `IRATA International anuncia novas empresas-membro certificadas em junho de 2026`,
      link: "https://irata.org/news/article/new-certified-irata-member-companies-june26",
      snippet:
        "IRATA International daria as boas-vindas às suas mais novas empresas-membro nomeadas em junho de 2026, incluindo empresas no Brasil, Índia e Indonésia.",
      source: "IRATA International",
      date: "06/07/2026",
    },
    {
      title: `HSE publishes latest annual work-related fatalities for 2025/26`,
      link: "https://press.hse.gov.uk/2026/07/01/latest-annual-work-related-fatalities-published-2/",
      snippet:
        "126 workers died in work-related incidents in 2025/26. Falls from height remain the leading cause of workplace fatalities in Great Britain with 31 deaths.",
      source: "HSE Media Centre",
      date: "01/07/2026",
    },
    {
      title: `Alerta de segurança Petzl: substituição do D-ring ventral em cinturões ASTRO e CANYON GUIDE`,
      link: "https://www.petzl.com/INT/en/Professional/safety-alerts/2026-02-23/ASTRO-and-CANYON-GUIDE-harness-safety-alert--Replacement-of-the-ventral-D-ring",
      snippet:
        "Substituição obrigatória do D-ring ventral em todos os cinturões ASTRO e CANYON GUIDE fabricados antes de outubro de 2023.",
      source: "Petzl",
      date: "23/02/2026",
    },
    {
      title:
        "CCTV footage captures harrowing moment worker falls through roof skylight in Yorkshire",
      link: "https://press.hse.gov.uk/2026/06/10/cctv-footage-captures-harrowing-moment-worker-falls-through-roof/",
      snippet:
        "26-year-old scaffolder suffered broken arm, leg and head injury after falling more than 6 metres through a roof skylight in Keighley, West Yorkshire.",
      source: "HSE Media Centre",
      date: "10/06/2026",
    },
    {
      title:
        "RAC Meeting Southern Africa — IRATA International regional meeting in Cape Town",
      link: "https://irata.org/events/event/rac-meeting-southern-africa-16-july-2026",
      snippet:
        "The IRATA Southern Africa RAC is convening for a meeting in Cape Town, South Africa on 16th July 2026.",
      source: "IRATA International",
      date: "16/07/2026",
    },
  ].filter((r) => r.title.toLowerCase().includes(query.toLowerCase().split(" ")[0]));
}
