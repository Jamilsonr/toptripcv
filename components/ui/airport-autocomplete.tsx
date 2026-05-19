"use client"

import { MapPin } from "lucide-react"
import { type ComponentType, useMemo, useRef, useState } from "react"

import {
  airportOptions,
  formatAirportOption,
  getAirportDescription,
  normalizeAirportSearch,
} from "@/lib/airports"
import { cn } from "@/lib/utils"

type IconComponent = ComponentType<{ size?: number; className?: string }>

export function AirportAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  icon: Icon = MapPin,
}: {
  value: string
  onChange: (next: string) => void
  placeholder: string
  className?: string
  inputClassName?: string
  icon?: IconComponent
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const suggestions = useMemo(() => {
    const query = normalizeAirportSearch(value)

    const sorted = airportOptions
      .map((option) => {
        const label = formatAirportOption(option)
        const description = getAirportDescription(option)
        const haystack = normalizeAirportSearch(
          `${option.city} ${option.airport} ${option.code} ${option.country} ${label} ${description}`
        )

        let score = 0
        if (!query) {
          score = 1
        } else if (normalizeAirportSearch(option.city).startsWith(query)) {
          score = 5
        } else if (normalizeAirportSearch(label).startsWith(query)) {
          score = 4
        } else if (normalizeAirportSearch(option.code).startsWith(query)) {
          score = 4
        } else if (haystack.includes(query)) {
          score = 2
        }

        return { option, label, description, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.label.localeCompare(b.label)
      })

    return sorted.slice(0, 8)
  }, [value])

  const showSuggestions = isOpen && suggestions.length > 0

  const selectSuggestion = (next: string) => {
    onChange(next)
    setIsOpen(false)
    setHighlightedIndex(0)
  }

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center text-slate-500">
        <Icon size={18} />
      </div>

      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
          setHighlightedIndex(0)
        }}
        onFocus={() => {
          if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
          setIsOpen(true)
        }}
        onBlur={() => {
          blurTimeoutRef.current = setTimeout(() => setIsOpen(false), 120)
        }}
        onKeyDown={(e) => {
          if (!showSuggestions) return

          if (e.key === "ArrowDown") {
            e.preventDefault()
            setHighlightedIndex((current) => (current + 1) % suggestions.length)
          }

          if (e.key === "ArrowUp") {
            e.preventDefault()
            setHighlightedIndex((current) =>
              current === 0 ? suggestions.length - 1 : current - 1
            )
          }

          if (e.key === "Enter") {
            e.preventDefault()
            selectSuggestion(suggestions[highlightedIndex]?.label ?? value)
          }

          if (e.key === "Escape") {
            setIsOpen(false)
          }
        }}
        placeholder={placeholder}
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          inputClassName
        )}
      />

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-background shadow-xl">
          <div className="border-b bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sugestões
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {suggestions.map((item, index) => (
              <li key={`${item.option.code}-${item.label}`}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full flex-col px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground",
                    index === highlightedIndex && "bg-accent text-accent-foreground"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(item.label)}
                >
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
