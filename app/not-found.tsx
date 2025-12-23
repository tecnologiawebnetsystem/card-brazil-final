import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Construction, Home, ArrowLeft, Wrench, Clock } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-healthcare flex items-center justify-center p-4">
      <Card className="healthcare-card max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          {/* Ícone principal animado */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <Construction className="w-16 h-16 text-primary animate-pulse" />
            </div>
            {/* Ícones decorativos flutuantes */}
            <Wrench
              className="absolute top-4 right-8 w-6 h-6 text-accent/60 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            />
            <Clock
              className="absolute bottom-4 left-8 w-6 h-6 text-secondary/60 animate-bounce"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Título principal */}
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Página em Construção</h1>

          {/* Subtítulo */}
          <p className="text-xl text-muted-foreground mb-6 text-pretty">
            Esta funcionalidade está sendo desenvolvida com muito carinho para você!
          </p>

          {/* Descrição */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
            <p className="text-muted-foreground text-pretty leading-relaxed">
              Nossa equipe está trabalhando para trazer esta nova funcionalidade para o
              <span className="font-semibold text-primary"> CardBrazil CRM</span>. Em breve você terá acesso a mais uma
              ferramenta poderosa para gerenciar seu negócio na área da saúde.
            </p>
          </div>

          {/* Barra de progresso simulada */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso do desenvolvimento</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="healthcare-button">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>

            <Button variant="outline" asChild className="border-primary/30 hover:bg-primary/5 bg-transparent">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Página Anterior
              </Link>
            </Button>
          </div>

          {/* Rodapé informativo */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Tem alguma sugestão? Entre em contato conosco através do suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
