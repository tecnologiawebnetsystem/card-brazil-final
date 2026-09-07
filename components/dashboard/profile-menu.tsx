"use client"

import Link from "next/link"
import { ChevronDown, LogOut, Moon, Settings, Sun, UserRound, KeyRound } from "lucide-react"
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
        <Button variant="ghost" className="h-11 gap-2 rounded-xl border border-border/70 bg-background/60 px-2.5 shadow-sm transition-colors hover:bg-accent" aria-label="Abrir menu do perfil">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} style={{ left: "calc(100vw - 19rem)", right: "auto", top: "4rem" }} className="fixed w-72 rounded-2xl border-border/80 bg-popover/95 p-2 shadow-xl backdrop-blur">
        <DropdownMenuLabel className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-3">
          <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback></Avatar>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{email || "Conta CardBrazil"}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5"><Link href="/dashboard/perfil"><UserRound className="mr-2 h-4 w-4" />Meu perfil</Link></DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5"><Link href="/dashboard/perfil#seguranca"><KeyRound className="mr-2 h-4 w-4" />Alterar senha</Link></DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5"><Link href="/dashboard/configuracoes"><Settings className="mr-2 h-4 w-4" />Configurações</Link></DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl px-3 py-2.5" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {resolvedTheme === "dark" ? "Modo claro" : "Modo escuro"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void logout()} className="rounded-xl px-3 py-2.5 text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
