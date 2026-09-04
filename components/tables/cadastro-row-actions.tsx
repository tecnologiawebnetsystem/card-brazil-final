"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Pencil, Power } from "lucide-react"
import { cn } from "@/lib/utils"

interface CadastroRowActionsProps {
  onView?: () => void
  onEdit?: () => void
  onToggleStatus?: () => void
  /** Quando informado, controla o rótulo/estilo do botão de status */
  isActive?: boolean
  disabled?: boolean
}

/**
 * Conjunto padronizado de ações usado em todas as páginas de cadastro.
 * Ícones e tooltips idênticos: Visualizar (olho), Editar (lápis) e Ativar/Desativar (power).
 */
export function CadastroRowActions({
  onView,
  onEdit,
  onToggleStatus,
  isActive,
  disabled,
}: CadastroRowActionsProps) {
  const toggleLabel = isActive ? "Desativar" : "Ativar"

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-end gap-1">
        {onView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={onView}
                disabled={disabled}
                aria-label="Visualizar"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>
        )}

        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={onEdit}
                disabled={disabled}
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}

        {onToggleStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 hover:bg-muted",
                  isActive
                    ? "text-muted-foreground hover:text-destructive"
                    : "text-muted-foreground hover:text-emerald-600",
                )}
                onClick={onToggleStatus}
                disabled={disabled}
                aria-label={toggleLabel}
              >
                <Power className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{toggleLabel}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
