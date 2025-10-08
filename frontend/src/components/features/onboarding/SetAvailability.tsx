import type React from "react"
import type { Dispatch , SetStateAction } from "react";
import { X, Plus } from "lucide-react"
import type { TimeSlot } from "../../../redux/types/onboard";
import CustomSwitch from './switch';


interface SetAvailabilityProps {
  currentStep: number
  availability: Record<Day, TimeSlot[]>;
  setAvailability: Dispatch<SetStateAction<Record<Day, TimeSlot[]>>>;
  enabledDays: Record<Day, boolean>;
  setEnabledDays: Dispatch<SetStateAction<Record<Day, boolean>>>;
  onNext: () => void
}

type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

const SetAvailability: React.FC<SetAvailabilityProps> = ({
  onNext,
  availability,
  setAvailability,
  enabledDays,
  setEnabledDays
}) => {
  const days: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

 const handleToggleDay = (day: Day, checked: boolean) => {
    setEnabledDays((prev) => ({ ...prev, [day]: checked }))
    if (!checked) {
      setAvailability((prev) => ({ ...prev, [day]: [] }))
    } else if (availability[day].length === 0) {
      setAvailability((prev) => ({
        ...prev,
        [day]: [{ start: "09:00", end: "17:00" }],
      }))
    }
  }

  const handleAddSlot = (day: Day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "09:00", end: "17:00" }],
    }))
  }

  const handleDeleteSlot = (day: Day, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }))
  }

  const handleTimeChange = (day: Day, index: number, field: "start" | "end", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    }))
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 px-6">

      {/* Days List */}
      <div className="space-y-5">
        {days.map((day) => {
          const isEnabled = enabledDays[day]
          const hasSlots = availability[day].length > 0

          return (
            <div
              key={day}
              className={`group rounded-lg border bg-card p-4 shadow-xs transition-all ${
                isEnabled ? "border-border hover:shadow-sm" : "border-border/50 bg-muted/30"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CustomSwitch checked={isEnabled} onCheckedChange={(checked) => handleToggleDay(day, checked)} />
                  <span
                    className={`text-base font-medium transition-colors ${
                      isEnabled ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </span>
                </div>

                {isEnabled && (
                  <button
                    onClick={() => handleAddSlot(day)}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--borderGray-bg)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] transition-all hover:bg-[var(--primary-text)]/5 hover:shadow-sm active:scale-95"
                  >
                    <Plus className="size-3.5" />
                    Add Time
                  </button>
                )}
              </div>

              {/* Time Slots */}
              {isEnabled && hasSlots && (
                <div className="mt-4 space-y-2.5">
                  {availability[day].map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md bg-muted/50 p-2.5 transition-colors hover:bg-muted/70"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleTimeChange(day, index, "start", e.target.value)}
                          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs transition-colors focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/50"
                        />
                        <span className="text-muted-foreground">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleTimeChange(day, index, "end", e.target.value)}
                          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs transition-colors focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/50"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(day, index)}
                        className="flex size-8 items-center justify-center rounded-md  bg-red-500/10 text-red-500 active:scale-95"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {isEnabled && !hasSlots && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-[var(--secondary-text)]">No time slots added</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="w-full rounded-lg bg-[var(--primary-text)] px-6 py-3 mt-5 text-base font-semibold text-[var(--primary-bg)] shadow-md transition-all hover:bg-[var(--button-hover-bg)] hover:shadow-lg active:scale-[0.98]"
      >
        Nearly there! →
      </button>
    </div>
  )
}

export default SetAvailability

