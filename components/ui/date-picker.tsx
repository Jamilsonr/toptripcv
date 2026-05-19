"use client"

import { CalendarDays } from "lucide-react"
import { format, parseISO } from "date-fns"
import { pt } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function DatePicker({
  value,
  onChange,
  minDate,
  className,
  placeholder = "dd/mm/aaaa",
}: {
  value: string
  onChange: (next: string) => void
  minDate?: Date
  className?: string
  placeholder?: string
}) {
  const date = value ? parseISO(value) : undefined
  const disabledBefore = minDate ?? startOfToday()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "relative h-11 w-full justify-start rounded-xl pl-10 font-normal text-left",
            className
          )}
        >
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-primary">
            <CalendarDays size={18} />
          </span>
          {date ? (
            <span className="text-foreground">{format(date, "dd/MM/yyyy")}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
          disabled={{ before: disabledBefore }}
          locale={pt}
        />
        <div className="flex items-center justify-end border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            Limpar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
