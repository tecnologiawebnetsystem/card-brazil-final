"use client"

import type React from "react"
import Button from "@/src/components/Button"

const Home: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">CardBrazil</h1>
      <p className="text-lg mb-6">Bem-vindo ao seu projeto React com TypeScript</p>
      <Button onClick={() => alert("Botão clicado!")}>Clique aqui</Button>
    </div>
  )
}

export default Home
