"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CadastroRowActions } from "./cadastro-row-actions"

export interface CadastroColumn<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  /** valor usado para ordenação, quando diferente do texto renderizado */
  sortValue?: (item: T) => string | number
  sortable?: boolean
  className?: string
  headerClassName?: string
}

interface CadastroTableProps<T> {
  data: T[]
  columns: CadastroColumn<T>[]
  getId: (item: T) => string | number
  /** texto usado pela busca global */
  getSearchText: (item: T) => string
  /** define o status ativo/inativo do registro (habilita coluna e filtro de status) */
  isActive?: (item: T) => boolean
  loading?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  pageSize?: number
  /** filtros adicionais renderizados ao lado da busca */
  extraFilters?: React.ReactNode
  onView?: (item: T) => void
  onEdit?: (item: T) => void
  onToggleStatus?: (item: T) => void
  /** conteúdo do modal de visualização padrão (usado quando onView não é informado) */
  renderDetails?: (item: T) => React.ReactNode
  detailsTitle?: (item: T) => string
}

type StatusFilter = "todos" | "ativos" | "inativos"

export function CadastroTable<T>({
  data,
  columns,
  getId,
  getSearchText,
  isActive,
  loading = false,
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum registro encontrado.",
  pageSize = 10,
  extraFilters,
  onView,
  onEdit,
  onToggleStatus,
  renderDetails,
  detailsTitle,
}: CadastroTableProps<T>) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(pageSize)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [detailItem, setDetailItem] = useState<T | null>(null)

  const hasStatus = typeof isActive === "function"
  const showViewAction = Boolean(onView) || Boolean(renderDetails)

  const handleView = (item: T) => {
    if (onView) {
      onView(item)
    } else if (renderDetails) {
      setDetailItem(item)
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = !search || getSearchText(item).toLowerCase().includes(search.toLowerCase())
      let matchesStatus = true
      if (hasStatus && statusFilter !== "todos") {
        const ativo = isActive!(item)
        matchesStatus = statusFilter === "ativos" ? ativo : !ativo
      }
      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter, hasStatus, isActive, getSearchText])

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData
    const column = columns.find((c) => c.key === sortColumn)
    if (!column) return filteredData
    const direction = sortDirection === "asc" ? 1 : -1
    return [...filteredData].sort((a, b) => {
      const aValue = column.sortValue ? column.sortValue(a) : String((a as any)[sortColumn] ?? "")
      const bValue = column.sortValue ? column.sortValue(b) : String((b as any)[sortColumn] ?? "")
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction
      }
      return String(aValue).localeCompare(String(bValue), "pt-BR", { numeric: true }) * direction
    })
  }, [filteredData, sortColumn, sortDirection, columns])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (column: CadastroColumn<T>) => {
    if (!column.sortable) return
    if (sortColumn === column.key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column.key)
      setSortDirection("asc")
    }
  }

  const totalColumns = columns.length + (hasStatus ? 1 : 0) + 1

  const resetToFirstPage = () => setCurrentPage(1)

  return (
    <div className="space-y-4">
      {/* Barra de filtros padronizada */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              resetToFirstPage()
            }}
            className="pl-9"
          />
        </div>

        {hasStatus && (
          <Select
            value={statusFilter}
            onValueChange={(value: StatusFilter) => {
              setStatusFilter(value)
              resetToFirstPage()
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativos">Apenas ativos</SelectItem>
              <SelectItem value="inativos">Apenas inativos</SelectItem>
            </SelectContent>
          </Select>
        )}

        {extraFilters}
      </div>

      {/* Grid de resultados */}
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    column.sortable && "cursor-pointer select-none",
                    column.headerClassName,
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable &&
                      (sortColumn === column.key ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      ))}
                  </div>
                </TableHead>
              ))}
              {hasStatus && (
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
              )}
              <TableHead className="w-[130px] text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={totalColumns} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={totalColumns} className="h-32 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => {
                const ativo = hasStatus ? isActive!(item) : undefined
                return (
                  <TableRow key={String(getId(item))} className="hover:bg-muted/40">
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn("py-3 text-sm", column.className)}>
                        {column.render ? column.render(item) : ((item as any)[column.key] ?? "—")}
                      </TableCell>
                    ))}
                    {hasStatus && (
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium",
                            ativo
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
                              : "border-border bg-muted text-muted-foreground",
                          )}
                        >
                          {ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="py-3">
                      <CadastroRowActions
                        onView={showViewAction ? () => handleView(item) : undefined}
                        onEdit={onEdit ? () => onEdit(item) : undefined}
                        onToggleStatus={onToggleStatus ? () => onToggleStatus(item) : undefined}
                        isActive={ativo}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Linhas por página:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              resetToFirstPage()
            }}
          >
            <SelectTrigger className="h-8 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {sortedData.length === 0
              ? "0 registros"
              : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, sortedData.length)} de ${sortedData.length}`}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              aria-label="Primeira página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de visualização padrão */}
      {renderDetails && (
        <Dialog open={detailItem !== null} onOpenChange={(open) => !open && setDetailItem(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{detailItem && detailsTitle ? detailsTitle(detailItem) : "Detalhes do registro"}</DialogTitle>
              <DialogDescription>Visualização somente leitura dos dados cadastrados.</DialogDescription>
            </DialogHeader>
            {detailItem && <div className="pt-2">{renderDetails(detailItem)}</div>}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
