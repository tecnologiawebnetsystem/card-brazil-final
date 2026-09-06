'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

interface AppThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: AppThemeProviderProps) {
  React.useEffect(() => {
    fetch("/api/configuracoes/tema", { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const theme = payload?.data
        if (theme) {
          document.documentElement.style.setProperty("--app-surface", theme.fundo)
          document.documentElement.style.setProperty("--app-sidebar", theme.menu)
        }
      })
      .catch(() => undefined)
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
