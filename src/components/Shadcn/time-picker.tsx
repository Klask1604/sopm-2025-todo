import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface TimePickerProps {
  value: string // Format: "HH:mm"
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour, setHour] = React.useState(() => {
    if (value) {
      return value.split(":")[0] || "00"
    }
    return "00"
  })

  const [minute, setMinute] = React.useState(() => {
    if (value) {
      return value.split(":")[1] || "00"
    }
    return "00"
  })

  React.useEffect(() => {
    if (value) {
      const parts = value.split(":")
      if (parts[0]) setHour(parts[0])
      if (parts[1]) setMinute(parts[1])
    }
  }, [value])

  const handleHourChange = (newHour: string) => {
    setHour(newHour)
    onChange(`${newHour}:${minute}`)
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute)
    onChange(`${hour}:${newMinute}`)
  }

  const formatDisplayTime = () => {
    if (!hour || !minute) return "Pick a time"
    const h = parseInt(hour)
    const m = parseInt(minute)
    const period = h >= 12 ? "PM" : "AM"
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${displayHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`
  }

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatDisplayTime() : "Pick a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-slate-800 border-white/20" align="start">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Hour</label>
            <Select value={hour} onValueChange={handleHourChange}>
              <SelectTrigger className="w-20 bg-slate-900 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] bg-slate-800 border-white/20">
                {hours.map((h) => (
                  <SelectItem key={h} value={h} className="text-white hover:bg-white/10">
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center pt-6">
            <span className="text-xl text-white font-semibold">:</span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Minute</label>
            <Select value={minute} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-20 bg-slate-900 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] bg-slate-800 border-white/20">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m} className="text-white hover:bg-white/10">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="w-full text-xs text-gray-400 hover:text-white"
          >
            Clear time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

