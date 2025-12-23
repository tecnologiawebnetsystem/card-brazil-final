"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface AutocompleteOption {
  value: string
  label: string
}

interface AutocompleteInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  label?: string
  options: AutocompleteOption[]
  onSelect?: (option: AutocompleteOption) => void
  onChange?: (value: string) => void
  filterFn?: (option: AutocompleteOption, query: string) => boolean
}

export function AutocompleteInput({
  label,
  options,
  onSelect,
  onChange,
  filterFn,
  className,
  ...props
}: AutocompleteInputProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const defaultFilter = (option: AutocompleteOption, q: string) =>
    option.label.toLowerCase().includes(q.toLowerCase()) || option.value.toLowerCase().includes(q.toLowerCase())

  const filteredOptions = options.filter((option) => (filterFn || defaultFilter)(option, query))

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    setSelectedIndex(-1)
    onChange?.(value)
  }

  const handleSelect = (option: AutocompleteOption) => {
    setQuery(option.label)
    setIsOpen(false)
    onSelect?.(option)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="space-y-2 relative">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        className={cn(className)}
        autoComplete="off"
        {...props}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-accent flex items-center justify-between",
                selectedIndex === index && "bg-accent",
              )}
            >
              <span>{option.label}</span>
              {query === option.label && <Check className="h-4 w-4" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
