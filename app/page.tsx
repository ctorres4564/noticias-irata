import { PesquisaForm } from "@/components/pesquisa-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notícias IRATA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pesquisa, classificação e formatação de notícias sobre acesso por cordas e segurança em altura.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <PesquisaForm />
      <footer className="mt-12 text-center text-xs text-muted-foreground">
        Notícias IRATA — Pesquisa automatizada com fontes oficiais · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
