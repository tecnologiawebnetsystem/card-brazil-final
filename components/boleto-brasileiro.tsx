"use client"

import { Card, CardContent } from "@/components/ui/card"

interface BoletoBrasileiroProps {
  beneficiario: string
  plano: string
  vencimento: string
  valor: number
  nossoNumero: string
  codigoBarras: string
}

export function BoletoBrasileiro({
  beneficiario,
  plano,
  vencimento,
  valor,
  nossoNumero,
  codigoBarras,
}: BoletoBrasileiroProps) {
  // Gerar QR Code simples (em produção usar biblioteca específica)
  const qrCodeData = `00020126580014br.gov.bcb.pix0136${nossoNumero}520400005303986540${valor.toFixed(2)}5802BR5925CARDBRAZIL ADMINISTRADORA6009SAO PAULO62070503***6304`

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-gray-300">
      <CardContent className="p-0">
        {/* Cabeçalho do Boleto */}
        <div className="border-b-2 border-gray-300 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">CB</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">CardBrazil</h2>
                <p className="text-sm text-gray-600">Administradora de Saúde</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">001-9</p>
              <p className="text-sm text-gray-600">Banco do Brasil</p>
            </div>
          </div>
        </div>

        {/* Linha Digitável */}
        <div className="p-4 bg-white border-b border-gray-200">
          <p className="text-center text-lg font-mono font-bold tracking-wider">
            00190.00009 02580.014000 12345.678901 2 85470000{valor.toFixed(2).replace(".", "")}
          </p>
        </div>

        {/* Dados do Boleto */}
        <div className="p-4 bg-white">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border border-gray-300 p-2">
              <p className="text-xs text-gray-600 font-semibold">Beneficiário</p>
              <p className="text-sm font-medium">{beneficiario}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="text-xs text-gray-600 font-semibold">Plano</p>
              <p className="text-sm font-medium">{plano}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="text-xs text-gray-600 font-semibold">Vencimento</p>
              <p className="text-sm font-medium">{new Date(vencimento).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="border border-gray-300 p-2">
              <p className="text-xs text-gray-600 font-semibold">Nosso Número</p>
              <p className="text-sm font-medium">{nossoNumero}</p>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="text-xs text-gray-600 font-semibold">Agência/Código Beneficiário</p>
              <p className="text-sm font-medium">0001-9 / 1234567</p>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="text-xs text-gray-600 font-semibold">Espécie</p>
              <p className="text-sm font-medium">R$</p>
            </div>
            <div className="border border-gray-300 p-2 bg-yellow-50">
              <p className="text-xs text-gray-600 font-semibold">Valor do Documento</p>
              <p className="text-lg font-bold text-emerald-600">R$ {valor.toFixed(2)}</p>
            </div>
          </div>

          {/* Instruções */}
          <div className="border border-gray-300 p-3 mb-4">
            <p className="text-xs text-gray-600 font-semibold mb-2">Instruções</p>
            <div className="text-xs text-gray-700 space-y-1">
              <p>• Não receber após o vencimento</p>
              <p>• Multa de 2% após o vencimento</p>
              <p>• Juros de mora de 1% ao mês</p>
              <p>• Em caso de dúvidas, entre em contato: (11) 3333-4444</p>
            </div>
          </div>

          {/* Código de Barras e QR Code */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <p className="text-xs text-gray-600 font-semibold mb-2">Código de Barras</p>
              <div className="bg-white border border-gray-300 p-2">
                {/* Simulação do código de barras com barras verticais */}
                <div className="flex items-end h-12 space-x-px">
                  {Array.from({ length: 44 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: Math.random() > 0.5 ? "2px" : "1px",
                        height: `${20 + Math.random() * 28}px`,
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs font-mono mt-1">{codigoBarras}</p>
              </div>
            </div>

            <div className="ml-4">
              <p className="text-xs text-gray-600 font-semibold mb-2">PIX QR Code</p>
              <div className="w-24 h-24 bg-white border border-gray-300 flex items-center justify-center">
                {/* Simulação simples de QR Code */}
                <div className="grid grid-cols-8 gap-px">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t-2 border-gray-300 p-2 bg-gray-50">
          <p className="text-xs text-center text-gray-600">
            CardBrazil Administradora de Saúde - CNPJ: 12.345.678/0001-90 - www.cardbrazil.com.br
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
