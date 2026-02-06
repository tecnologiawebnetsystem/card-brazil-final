"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Phone, Shield, Building2, Users, User, CheckCircle, AlertCircle } from "lucide-react"

export default function EsqueciSenhaPage() {
  const [step, setStep] = useState(1) // 1: identificação, 2: método recuperação, 3: confirmação
  const [userType, setUserType] = useState("")
  const [recoveryMethod, setRecoveryMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()

  const userTypes = [
    { value: "admin", label: "Administrador", icon: Shield },
    { value: "operadora", label: "Operadora", icon: Building2 },
    { value: "estipulante", label: "Estipulante", icon: Users },
    { value: "subestipulante", label: "Sub-estipulante", icon: User },
    { value: "usuario", label: "Usuário", icon: User },
  ]

  const handleSubmitIdentification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep(2)
  }

  const handleSubmitRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending recovery
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Login
          </Button>

          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#dc2626] to-[#c2410c] rounded-xl flex items-center justify-center shadow-lg shadow-[#dc2626]/20">
              <Shield className="w-6 h-6 text-[#ffffff]" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#dc2626] to-[#c2410c] bg-clip-text text-transparent">
                Talent Health
              </h1>
              <p className="text-sm text-[#a3a3a3]">Recuperacao de Acesso</p>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl shadow-[#dc2626]/10 border border-[#262626] bg-[#141414]/95 backdrop-blur-sm">
          {step === 1 && (
            <>
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl font-bold">Esqueci minha senha</CardTitle>
                <CardDescription>Informe seus dados para recuperar o acesso ao sistema</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmitIdentification} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="userType">Tipo de Usuário</Label>
                    <Select value={userType} onValueChange={setUserType} required>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione seu tipo de usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email">Email ou CPF</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Digite seu email ou CPF"
                      className="h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {(userType === "operadora" || userType === "estipulante" || userType === "subestipulante") && (
                    <div className="space-y-3">
                      <Label htmlFor="codigo">
                        Código da{" "}
                        {userType === "operadora"
                          ? "Operadora"
                          : userType === "estipulante"
                            ? "Estipulante"
                            : "Sub-estipulante"}
                      </Label>
                      <Input id="codigo" type="text" placeholder={`Digite o código da ${userType}`} className="h-12" />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 healthcare-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#ffffff]/30 border-t-[#ffffff] rounded-full animate-spin" />
                        Verificando...
                      </div>
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl font-bold">Método de Recuperação</CardTitle>
                <CardDescription>Escolha como deseja receber as instruções de recuperação</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Usuário encontrado: <strong>{email}</strong>
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmitRecovery} className="space-y-6">
                  <div className="space-y-4">
                    <Label>Método de Recuperação</Label>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="recovery"
                          value="email"
                          checked={recoveryMethod === "email"}
                          onChange={(e) => setRecoveryMethod(e.target.value)}
                          className="text-primary"
                        />
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-sm text-muted-foreground">
                            Enviar instruções para {email.includes("@") ? email : "email cadastrado"}
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          type="radio"
                          name="recovery"
                          value="sms"
                          checked={recoveryMethod === "sms"}
                          onChange={(e) => setRecoveryMethod(e.target.value)}
                          className="text-primary"
                        />
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">SMS</div>
                          <div className="text-sm text-muted-foreground">Enviar código para celular cadastrado</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 healthcare-button"
                    disabled={isLoading || !recoveryMethod}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Enviar Instruções"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">Instruções Enviadas!</CardTitle>
                <CardDescription>As instruções de recuperação foram enviadas com sucesso</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {recoveryMethod === "email"
                      ? `Enviamos um email com as instruções para ${email}`
                      : "Enviamos um SMS com o código de recuperação para seu celular cadastrado"}
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Próximos passos:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Verifique sua caixa de entrada {recoveryMethod === "email" ? "de email" : "de SMS"}</li>
                      <li>Siga as instruções recebidas</li>
                      <li>Crie uma nova senha segura</li>
                      <li>Faça login com suas novas credenciais</li>
                    </ul>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      onClick={() => router.push("/")}
                      className="w-full h-12 healthcare-button"
                    >
                      Voltar ao Login
                    </Button>

                    <Button variant="outline" onClick={() => setStep(1)} className="w-full h-12">
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
