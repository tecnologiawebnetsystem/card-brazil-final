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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#008080] to-[#006666] rounded-xl flex items-center justify-center shadow-lg shadow-[#008080]/20">
              <ShieldX className="w-6 h-6 text-[#ffffff]" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#008080] to-[#006666] bg-clip-text text-transparent">
                Talent Health
              </h1>
              <p className="text-sm text-[#a3a3a3]">Controle de Acesso</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl shadow-[#008080]/10 border-[#262626] bg-[#141414]/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="w-20 h-20 bg-[#008080]/10 rounded-full flex items-center justify-center mx-auto border border-[#008080]/20">
              <AlertTriangle className="w-10 h-10 text-[#008080]" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-[#008080]">Acesso Negado</CardTitle>
              <CardDescription className="text-base">
                Você não possui permissão para acessar esta área do sistema
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-[#008080]/20 bg-[#008080]/5">
              <AlertTriangle className="h-4 w-4 text-[#008080]" />
              <AlertDescription className="text-[#f5f5f5]">
                <strong>Motivos possíveis:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Seu perfil de usuário não tem permissão para esta funcionalidade</li>
                  <li>Sua sessão pode ter expirado</li>
                  <li>Esta área requer privilégios administrativos</li>
                  <li>Sua conta pode estar temporariamente suspensa</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 rounded-lg p-4">
              <h4 className="font-semibold text-[#f5f5f5] mb-2">O que voce pode fazer:</h4>
              <div className="space-y-2 text-sm text-[#a3a3a3]">
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
              <Button onClick={handleGoBack} className="w-full h-12 healthcare-button">
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
                className="w-full h-12 border-[#008080]/30 text-[#008080] hover:bg-[#008080]/10"
              >
                Fazer Login Novamente
              </Button>
            </div>

            <div className="pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground mb-3">Precisa de ajuda? Entre em contato:</p>
              <div className="flex justify-center gap-4">
                <Button variant="link" size="sm" className="text-primary">
                  <Mail className="w-4 h-4 mr-1" />
                  suporte@talenthealth.com.br
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
