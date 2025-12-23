"use client"

import type React from "react"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MaskedInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  mask: "cpf" | "cnpj" | "phone" | "cep" | "date" | "currency"
  onChange?: (value: string) => void
}

const masks = {
  cpf: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  },
  cnpj: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  },
  phone: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  },
  cep: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1")
  },
  date: (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\/\d{4})\d+?$/, "$1")
  },
  currency: (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const amount = Number(numbers) / 100
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  },
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = masks[mask](e.target.value)
      e.target.value = maskedValue
      onChange?.(maskedValue)
    }

    return <Input ref={ref} onChange={handleChange} className={cn(className)} {...props} />
  },
)

MaskedInput.displayName = "MaskedInput"
