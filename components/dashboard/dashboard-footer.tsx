"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto shadow-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Company info */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Talent Health CRM</span>
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                v2.1.0
              </Badge>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-4" />

            <div className="text-center md:text-left"></div>
          </div>

          {/* Right side - Copyright and links */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                Usuarios Online:{" "}
                <Badge variant="outline" className="ml-1 border-primary/30 text-primary">
                  12
                </Badge>
              </span>
              <span>
                Uptime:{" "}
                <Badge variant="outline" className="ml-1 text-success border-success/30">
                  99.9%
                </Badge>
              </span>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-4" />

            <div className="text-center">
              <p>© {currentYear} Talent Health. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
