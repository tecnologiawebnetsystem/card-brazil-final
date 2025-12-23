"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface Endereco {
  id: number
  tipo: "residencial" | "comercial" | "cobranca"
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  email?: string
}

interface AddressCardProps {
  endereco: Endereco
  onEdit: (endereco: Endereco) => void
  onDelete: (id: number) => void
}

export function AddressCard({ endereco, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base capitalize">Endereço {endereco.tipo}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(endereco)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(endereco.id)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">CEP</Label>
            <p>{endereco.cep}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Logradouro</Label>
            <p>
              {endereco.logradouro}, {endereco.numero}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Bairro</Label>
            <p>{endereco.bairro}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Cidade</Label>
            <p>{endereco.cidade}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Estado</Label>
            <p>{endereco.estado}</p>
          </div>
          {endereco.email && (
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p>{endereco.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
