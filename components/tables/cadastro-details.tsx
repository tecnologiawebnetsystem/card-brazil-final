import type React from "react"

interface DetailFieldProps {
  label: string
  value?: React.ReactNode
  full?: boolean
}

/** Grade padronizada para o modal de visualização das páginas de cadastro. */
export function CadastroDetailsGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">{children}</div>
}

export function CadastroDetailField({ label, value, full }: DetailFieldProps) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm text-foreground">
        {value === undefined || value === null || value === "" ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          value
        )}
      </div>
    </div>
  )
}
