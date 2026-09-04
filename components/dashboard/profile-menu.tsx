"use client"

import Link from "next/link"
import { LogOut, Moon, Settings, Sun, UserRound, KeyRound } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const name = user?.nome_completo?.trim() || "Usuário CardBrazil"
  const email = user?.email || ""
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2 hover:bg-accent" aria-label="Abrir menu do perfil">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-left text-sm font-medium md:block">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-3">
          <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback></Avatar>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{email || "Conta CardBrazil"}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/dashboard/perfil"><UserRound className="mr-2 h-4 w-4" />Meu perfil</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/dashboard/perfil#seguranca"><KeyRound className="mr-2 h-4 w-4" />Alterar senha</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/dashboard/configuracoes"><Settings className="mr-2 h-4 w-4" />Configurações</Link></DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {resolvedTheme === "dark" ? "Modo claro" : "Modo escuro"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void logout()} className="text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
