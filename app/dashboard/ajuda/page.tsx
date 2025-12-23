import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, Book, MessageCircle, Phone, Mail } from "lucide-react"

export default function AjudaPage() {
  const faqItems = [
    {
      pergunta: "Como cadastrar um novo segurado?",
      resposta: "Acesse o menu Segurados e clique em 'Novo Segurado'. Preencha todos os dados obrigatórios.",
    },
    {
      pergunta: "Como aprovar um sinistro?",
      resposta: "No menu Sinistros, localize o sinistro desejado e clique em 'Ver Detalhes' para analisar e aprovar.",
    },
    {
      pergunta: "Como gerar relatórios financeiros?",
      resposta: "Acesse o menu Relatórios, selecione 'Relatório Financeiro Mensal' e clique em 'Gerar'.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Central de Ajuda</h1>
            <p className="text-muted-foreground">Encontre respostas e suporte para o sistema CardBrazil</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Busque por ajuda, tutoriais ou documentação..." className="pl-12 h-12 text-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">Documentação</h3>
              <p className="text-sm text-muted-foreground">Guias completos do sistema</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">Chat Suporte</h3>
              <p className="text-sm text-muted-foreground">Fale conosco em tempo real</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">Telefone</h3>
              <p className="text-sm text-muted-foreground">(11) 3456-7890</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">suporte@cardbrazil.com.br</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground mb-2">{item.pergunta}</h3>
                      <p className="text-sm text-muted-foreground">{item.resposta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">Ver Todas as Perguntas</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
