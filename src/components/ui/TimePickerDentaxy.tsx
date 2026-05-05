import * as React from "react"
import { Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TimePickerProps {
  value: string; // "HH:mm" 24h format
  onChange: (value: string) => void;
  className?: string;
}

export function TimePickerDentaxy({ value, onChange, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mode, setMode] = React.useState<"hours" | "minutes">("hours")
  
  // Parse current value
  const initialTime = value || "12:00"
  const [h, m] = initialTime.split(":").map(Number)
  const isPM = h >= 12
  const displayH = h % 12 || 12
  const displayM = m

  const handleHourSelect = (hour: number) => {
    let newH = hour
    if (isPM && hour < 12) newH += 12
    if (!isPM && hour === 12) newH = 0
    onChange(`${newH.toString().padStart(2, "0")}:${displayM.toString().padStart(2, "0")}`)
    setMode("minutes")
  }

  const handleMinuteSelect = (minute: number) => {
    onChange(`${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
  }

  const toggleAMPM = () => {
    let newH = h
    if (isPM) {
      newH -= 12 // To AM
    } else {
      newH += 12 // To PM
    }
    onChange(`${newH.toString().padStart(2, "0")}:${displayM.toString().padStart(2, "0")}`)
  }

  const formatDisplayTime = () => {
    const hours = h % 12 || 12
    const mins = m.toString().padStart(2, "0")
    const period = isPM ? "PM" : "AM"
    return `${hours}:${mins} ${period}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-10 px-3",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-blue-500" />
          <span>{value ? formatDisplayTime() : "Seleccionar hora"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800" align="start">
        <div className="flex flex-col items-center space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setMode("hours")}
                className={cn(
                  "text-2xl font-bold transition-colors",
                  mode === "hours" ? "text-blue-600" : "text-gray-300"
                )}
              >
                {displayH}
              </button>
              <span className="text-2xl font-bold text-gray-300">:</span>
              <button 
                onClick={() => setMode("minutes")}
                className={cn(
                  "text-2xl font-bold transition-colors",
                  mode === "minutes" ? "text-blue-600" : "text-gray-300"
                )}
              >
                {displayM.toString().padStart(2, "0")}
              </button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAMPM}
              className="text-xs font-bold bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {isPM ? "PM" : "AM"}
            </Button>
          </div>

          {/* Clock Face */}
          <div className="relative w-48 h-48 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-700">
            {/* Center Dot */}
            <div className="absolute w-2 h-2 bg-blue-500 rounded-full z-10" />
            
            {/* Hand */}
            <motion.div 
              className="absolute w-1 bg-blue-500 origin-bottom rounded-full"
              style={{ 
                height: "40%", 
                bottom: "50%",
                left: "calc(50% - 2px)",
                rotate: mode === "hours" ? (displayH * 30) : (displayM * 6)
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Numbers */}
            <AnimatePresence mode="wait">
              {mode === "hours" ? (
                <motion.div 
                  key="hours"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="absolute inset-0"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const angle = (num * 30) * (Math.PI / 180)
                    const radius = 75
                    const x = Math.sin(angle) * radius
                    const y = -Math.cos(angle) * radius
                    return (
                      <button
                        key={num}
                        onClick={() => handleHourSelect(num)}
                        className={cn(
                          "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:bg-blue-100 dark:hover:bg-blue-900/30",
                          displayH === num ? "bg-blue-500 text-white shadow-lg" : "text-gray-600 dark:text-gray-400"
                        )}
                        style={{
                          left: `calc(50% + ${x}px - 16px)`,
                          top: `calc(50% + ${y}px - 16px)`
                        }}
                      >
                        {num}
                      </button>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.div 
                  key="minutes"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="absolute inset-0"
                >
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((num) => {
                    const angle = (num * 6) * (Math.PI / 180)
                    const radius = 75
                    const x = Math.sin(angle) * radius
                    const y = -Math.cos(angle) * radius
                    return (
                      <button
                        key={num}
                        onClick={() => handleMinuteSelect(num)}
                        className={cn(
                          "absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all hover:bg-blue-100 dark:hover:bg-blue-900/30",
                          displayM === num ? "bg-blue-500 text-white shadow-lg" : "text-gray-600 dark:text-gray-400"
                        )}
                        style={{
                          left: `calc(50% + ${x}px - 16px)`,
                          top: `calc(50% + ${y}px - 16px)`
                        }}
                      >
                        {num}
                      </button>
                    )
                  })}
                  {/* Additional 1-minute steps could be added as small dots if needed */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between w-full mt-2">
            <Button variant="ghost" size="sm" onClick={() => setMode(mode === "hours" ? "minutes" : "hours")}>
              {mode === "hours" ? "Ver Minutos" : "Ver Horas"}
            </Button>
            <Button size="sm" className="bg-zinc-900 dark:bg-zinc-100" onClick={() => setIsOpen(false)}>
              Aceptar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
