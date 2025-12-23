"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  onDateChange?: (from: Date | undefined, to: Date | undefined) => void
  className?: string
}

export function DateRangePicker({ onDateChange, className }: DateRangePickerProps) {
  const [from, setFrom] = useState<Date | undefined>(undefined)
  const [to, setTo] = useState<Date | undefined>(undefined)

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setFrom(range?.from)
    setTo(range?.to)
    onDateChange?.(range?.from, range?.to)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal", !from && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? (
              <>
                {format(from, "dd/MM/yyyy", { locale: ptBR })} - {format(to, "dd/MM/yyyy", { locale: ptBR })}
              </>
            ) : (
              format(from, "dd/MM/yyyy", { locale: ptBR })
            )
          ) : (
            <span>Selecione o período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={{ from, to }} onSelect={handleSelect} numberOfMonths={2} locale={ptBR} />
      </PopoverContent>
    </Popover>
  )
}
