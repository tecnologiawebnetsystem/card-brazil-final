"use client"

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Talent</span>
          <p>© {currentYear} Talent. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
