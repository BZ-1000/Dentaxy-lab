
import { IconCloud } from "@/components/ui/interactive-icon-cloud"

const dentalSlugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
  "nodedotjs",
  "postgresql",
  "vercel",
  "git",
  "github",
  "visualstudiocode",
  "figma",
]

export function DentalBackgroundCloud() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-[800px] h-[600px]">
          <IconCloud iconSlugs={dentalSlugs} />
        </div>
      </div>
    </div>
  )
}
