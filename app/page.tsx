import { PesquisaForm } from "@/components/pesquisa-form";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          🔍 Notícias IRATA
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Pesquisa, classificação e formatação de notícias sobre acesso por cordas e segurança em altura.
        </p>
      </header>
      <PesquisaForm />
      <footer className="mt-12 text-center text-xs text-zinc-400">
        Notícias IRATA — Pesquisa automatizada com fontes oficiais · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
