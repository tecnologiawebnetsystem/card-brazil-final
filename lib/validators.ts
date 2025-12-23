export const validators = {
  required: (value: string) => {
    return value.trim() === "" ? "Este campo é obrigatório" : undefined
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(value) ? "Email inválido" : undefined
  },

  cpf: (value: string) => {
    const cpf = value.replace(/\D/g, "")
    if (cpf.length !== 11) return "CPF deve ter 11 dígitos"

    // Validação de CPF
    let sum = 0
    let remainder

    if (cpf === "00000000000") return "CPF inválido"

    for (let i = 1; i <= 9; i++) {
      sum += Number.parseInt(cpf.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.substring(9, 10))) return "CPF inválido"

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += Number.parseInt(cpf.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.substring(10, 11))) return "CPF inválido"

    return undefined
  },

  cnpj: (value: string) => {
    const cnpj = value.replace(/\D/g, "")
    if (cnpj.length !== 14) return "CNPJ deve ter 14 dígitos"

    // Validação de CNPJ
    if (/^(\d)\1+$/.test(cnpj)) return "CNPJ inválido"

    let length = cnpj.length - 2
    let numbers = cnpj.substring(0, length)
    const digits = cnpj.substring(length)
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number.parseInt(digits.charAt(0))) return "CNPJ inválido"

    length = length + 1
    numbers = cnpj.substring(0, length)
    sum = 0
    pos = length - 7

    for (let i = length; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number.parseInt(digits.charAt(1))) return "CNPJ inválido"

    return undefined
  },

  phone: (value: string) => {
    const phone = value.replace(/\D/g, "")
    return phone.length < 10 || phone.length > 11 ? "Telefone inválido" : undefined
  },

  minLength: (min: number) => (value: string) => {
    return value.length < min ? `Mínimo de ${min} caracteres` : undefined
  },

  maxLength: (max: number) => (value: string) => {
    return value.length > max ? `Máximo de ${max} caracteres` : undefined
  },

  combine:
    (...validators: Array<(value: string) => string | undefined>) =>
    (value: string) => {
      for (const validator of validators) {
        const error = validator(value)
        if (error) return error
      }
      return undefined
    },
}
