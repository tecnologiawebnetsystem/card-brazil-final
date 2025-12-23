"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DadoBancario {
  id?: number
  banco: string
  agencia: string
  tipoConta: "corrente" | "poupanca"
  conta: string
  digitoConta: string
}

interface BankAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (dadoBancario: Omit<DadoBancario, "id">) => void
  dadoBancario?: DadoBancario | null
  title?: string
  description?: string
}

export function BankAccountModal({
  isOpen,
  onClose,
  onSave,
  dadoBancario = null,
  title = "Adicionar Conta Bancária",
  description = "Cadastre uma nova conta bancária",
}: BankAccountModalProps) {
  const [formData, setFormData] = useState<Omit<DadoBancario, "id">>({
    banco: "",
    agencia: "",
    tipoConta: "corrente",
    conta: "",
    digitoConta: "",
  })

  useEffect(() => {
    if (dadoBancario) {
      setFormData({
        banco: dadoBancario.banco,
        agencia: dadoBancario.agencia,
        tipoConta: dadoBancario.tipoConta,
        conta: dadoBancario.conta,
        digitoConta: dadoBancario.digitoConta,
      })
    } else {
      setFormData({
        banco: "",
        agencia: "",
        tipoConta: "corrente",
        conta: "",
        digitoConta: "",
      })
    }
  }, [dadoBancario, isOpen])

  const handleSave = () => {
    if (!formData.banco || !formData.agencia || !formData.conta || !formData.digitoConta) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    onSave(formData)
    onClose()
  }

  const bancos = [
    "Banco do Brasil",
    "Bradesco",
    "Caixa Econômica Federal",
    "Itaú",
    "Santander",
    "Nubank",
    "Inter",
    "C6 Bank",
    "Sicoob",
    "Sicredi",
    "Outros",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dadoBancario ? "Editar Conta Bancária" : title}</DialogTitle>
          <DialogDescription>
            {dadoBancario ? "Altere as informações da conta bancária" : description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Banco *</Label>
            <Select value={formData.banco} onValueChange={(value) => setFormData({ ...formData, banco: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                {bancos.map((banco) => (
                  <SelectItem key={banco} value={banco}>
                    {banco}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Agência *</Label>
              <Input
                placeholder="0000-0"
                value={formData.agencia}
                onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
              />
            </div>
            <div>
              <Label>Tipo da Conta *</Label>
              <Select
                value={formData.tipoConta}
                onValueChange={(value: "corrente" | "poupanca") => setFormData({ ...formData, tipoConta: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Corrente</SelectItem>
                  <SelectItem value="poupanca">Poupança</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Conta *</Label>
              <Input
                placeholder="00000-0"
                value={formData.conta}
                onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
              />
            </div>
            <div>
              <Label>Dígito da Conta *</Label>
              <Input
                placeholder="0"
                maxLength={2}
                value={formData.digitoConta}
                onChange={(e) => setFormData({ ...formData, digitoConta: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>{dadoBancario ? "Salvar Alterações" : "Salvar Conta"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
