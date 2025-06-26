
import { IconCloud } from "@/components/ui/interactive-icon-cloud"
import { useEffect, useState } from "react"

const dentalSlugs = [
  "react",
  "typescript",
  "javascript",
  "html5",
  "css3",
  "tailwindcss",
  "nodejs",
  "vercel",
  "git",
  "github",
  "figma",
  "visualstudiocode"
]

export function DentalBackgroundCloud() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Aparecer gradualmente después de que cargue todo
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-[3000ms] ${
        isVisible ? 'opacity-20' : 'opacity-0'
      }`}
      style={{
        background: 'transparent'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center scale-150">
        <IconCloud iconSlugs={dentalSlugs} />
      </div>
    </div>
  )
}
