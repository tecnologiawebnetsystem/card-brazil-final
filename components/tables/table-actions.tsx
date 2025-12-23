"use client"

import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, Printer } from "lucide-react"
import { toast } from "sonner"

interface TableActionsProps {
  data: any[]
  filename?: string
  onExport?: (format: "excel" | "pdf") => void
  onPrint?: () => void
}

export function TableActions({ data, filename = "export", onExport, onPrint }: TableActionsProps) {
  const handleExportExcel = () => {
    if (onExport) {
      onExport("excel")
    } else {
      // Default export logic
      const csv = convertToCSV(data)
      downloadFile(csv, `${filename}.csv`, "text/csv")
      toast.success("Dados exportados para Excel")
    }
  }

  const handleExportPDF = () => {
    if (onExport) {
      onExport("pdf")
    } else {
      toast.info("Exportação para PDF em desenvolvimento")
    }
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
      toast.success("Preparando impressão...")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExportExcel}>
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <Download className="h-4 w-4 mr-2" />
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
    </div>
  )
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvRows = [headers.join(",")]

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      return `"${String(value).replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(","))
  }

  return csvRows.join("\n")
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
