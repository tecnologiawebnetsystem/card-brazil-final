"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Endereco {
  id?: number
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

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (endereco: Omit<Endereco, "id">) => void
  endereco?: Endereco | null
  title?: string
  description?: string
}

export function AddressModal({
  isOpen,
  onClose,
  onSave,
  endereco = null,
  title = "Adicionar Endereço",
  description = "Cadastre um novo endereço",
}: AddressModalProps) {
  const [formData, setFormData] = useState<Omit<Endereco, "id">>({
    tipo: "residencial",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    email: "",
  })

  const [isLoadingCep, setIsLoadingCep] = useState(false)

  useEffect(() => {
    if (endereco) {
      setFormData({
        tipo: endereco.tipo,
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento || "",
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        email: endereco.email || "",
      })
    } else {
      setFormData({
        tipo: "residencial",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        email: "",
      })
    }
  }, [endereco, isOpen])

  const handleCepChange = async (cep: string) => {
    setFormData({ ...formData, cep })

    if (cep.length === 9) {
      setIsLoadingCep(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }))
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      } finally {
        setIsLoadingCep(false)
      }
    }
  }

  const handleSave = () => {
    if (
      !formData.cep ||
      !formData.logradouro ||
      !formData.numero ||
      !formData.bairro ||
      !formData.cidade ||
      !formData.estado
    ) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{endereco ? "Editar Endereço" : title}</DialogTitle>
          <DialogDescription>{endereco ? "Altere as informações do endereço" : description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Endereço *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "residencial" | "comercial" | "cobranca") =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="cobranca">Cobrança</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>CEP *</Label>
              <Input
                placeholder="00000-000"
                value={formData.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                disabled={isLoadingCep}
              />
              {isLoadingCep && <p className="text-xs text-muted-foreground mt-1">Buscando CEP...</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label>Logradouro *</Label>
              <Input
                placeholder="Rua, Avenida, etc."
                value={formData.logradouro}
                onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
              />
            </div>
            <div>
              <Label>Número *</Label>
              <Input
                placeholder="123"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Complemento</Label>
            <Input
              placeholder="Apartamento, Sala, etc."
              value={formData.complemento}
              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Bairro *</Label>
              <Input
                placeholder="Bairro"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              />
            </div>
            <div>
              <Label>Cidade *</Label>
              <Input
                placeholder="Cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>
            <div>
              <Label>Estado *</Label>
              <Input
                placeholder="UF"
                maxLength={2}
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>{endereco ? "Salvar Alterações" : "Salvar Endereço"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
