"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface FilterConfig {
  key: string
  label: string
  type: "text" | "select" | "date"
  options?: { value: string; label: string }[]
}

interface FilterBarProps {
  filters: FilterConfig[]
  onFilterChange: (filters: Record<string, string>) => void
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters }
    if (value) {
      newFilters[key] = value
    } else {
      delete newFilters[key]
    }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...activeFilters }
    delete newFilters[key]
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearAll = () => {
    setActiveFilters({})
    onFilterChange({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros</h4>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    Limpar tudo
                  </Button>
                )}
              </div>
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <Label>{filter.label}</Label>
                  {filter.type === "text" && (
                    <Input
                      value={activeFilters[filter.key] || ""}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={`Filtrar por ${filter.label.toLowerCase()}`}
                    />
                  )}
                  {filter.type === "select" && filter.options && (
                    <select
                      value={activeFilters[filter.key] || ""}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Todos</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find((f) => f.key === key)
            return (
              <Badge key={key} variant="secondary" className="gap-1">
                <span className="text-xs">
                  {filter?.label}: {value}
                </span>
                <button onClick={() => handleRemoveFilter(key)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
