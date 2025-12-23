"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface ValidatedInputProps extends React.ComponentProps<typeof Input> {
  label?: string
  error?: string
  success?: string
  validate?: (value: string) => string | undefined
  showValidation?: boolean
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, error, success, validate, showValidation = true, className, onChange, ...props }, ref) => {
    const [validationMessage, setValidationMessage] = useState<string | undefined>()
    const [isValid, setIsValid] = useState<boolean | undefined>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (validate && showValidation) {
        const message = validate(value)
        setValidationMessage(message)
        setIsValid(!message)
      }

      onChange?.(e)
    }

    const displayError = error || validationMessage
    const displaySuccess = success || (isValid && !displayError)

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            onChange={handleChange}
            className={cn(
              displayError && "border-destructive focus-visible:ring-destructive",
              displaySuccess && "border-green-500 focus-visible:ring-green-500",
              className,
            )}
            {...props}
          />
          {showValidation && (displayError || displaySuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {displayError ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          )}
        </div>
        {displayError && <p className="text-sm text-destructive">{displayError}</p>}
        {displaySuccess && typeof displaySuccess === "string" && (
          <p className="text-sm text-green-600">{displaySuccess}</p>
        )}
      </div>
    )
  },
)

ValidatedInput.displayName = "ValidatedInput"
