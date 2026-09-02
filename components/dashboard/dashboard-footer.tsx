"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Company info */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#a1a1a1]">Portal Corporativo</span>
              <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground border border-border">
                v2.1.0
              </Badge>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-4 bg-[#262626]" />

            <div className="text-center md:text-left"></div>
          </div>

          {/* Right side - Copyright and links */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                Usuarios Online:{" "}
                <Badge variant="outline" className="ml-1 border-border text-primary">
                  12
                </Badge>
              </span>
              <span>
                Uptime:{" "}
                <Badge variant="outline" className="ml-1 text-[#00d084] border-[#262626]">
                  99.9%
                </Badge>
              </span>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-4 bg-[#262626]" />

            <div className="text-center">
              <p>© {currentYear} Portal Corporativo. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
