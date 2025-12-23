"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX, ArrowLeft, Mail, Phone, AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function AcessoNegadoPage() {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldX className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                CardBrazil
              </h1>
              <p className="text-sm text-muted-foreground">Controle de Acesso</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl shadow-red-500/10 border-red-200 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-red-700">Acesso Negado</CardTitle>
              <CardDescription className="text-base">
                Você não possui permissão para acessar esta área do sistema
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Motivos possíveis:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Seu perfil de usuário não tem permissão para esta funcionalidade</li>
                  <li>Sua sessão pode ter expirado</li>
                  <li>Esta área requer privilégios administrativos</li>
                  <li>Sua conta pode estar temporariamente suspensa</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">O que você pode fazer:</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Tente fazer login novamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Entre em contato com o administrador do sistema</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Solicite liberação de acesso via suporte</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleGoBack} className="w-full h-12 bg-gradient-to-r from-primary to-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Página Anterior
              </Button>

              <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full h-12">
                <Home className="w-4 h-4 mr-2" />
                Ir para o Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full h-12 border-red-200 text-red-700 hover:bg-red-50"
              >
                Fazer Login Novamente
              </Button>
            </div>

            <div className="pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground mb-3">Precisa de ajuda? Entre em contato:</p>
              <div className="flex justify-center gap-4">
                <Button variant="link" size="sm" className="text-primary">
                  <Mail className="w-4 h-4 mr-1" />
                  suporte@cardbrazil.com.br
                </Button>
                <Button variant="link" size="sm" className="text-primary">
                  <Phone className="w-4 h-4 mr-1" />
                  (11) 3000-0000
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
