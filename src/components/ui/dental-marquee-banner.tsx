
import { Marquee } from "@/components/ui/marquee"

const DentalLogos = {
  dentistry: () => (
    <div className="h-fit flex items-center justify-start font-bold text-xl gap-3 text-blue-600">
      <svg className="h-[30px] fill-blue-600" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      DENTAL CLINIC
    </div>
  ),
  healthcare: () => (
    <div className="h-fit flex items-center justify-start font-bold text-xl gap-3 text-green-600">
      <svg className="h-[30px] fill-green-600" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      HEALTHCARE AI
    </div>
  ),
  technology: () => (
    <div className="h-fit flex items-center justify-start font-bold text-xl gap-3 text-purple-600">
      <svg className="h-[30px] fill-purple-600" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      SMART RECORDS
    </div>
  ),
  ai: () => (
    <div className="h-fit flex items-center justify-start font-bold text-xl gap-3 text-indigo-600">
      <svg className="h-[30px] fill-indigo-600" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      DENTAXY.AI
    </div>
  ),
}

export function DentalMarqueeBanner() {
  const logos = [DentalLogos.dentistry, DentalLogos.healthcare, DentalLogos.technology, DentalLogos.ai]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <Marquee speed={20} className="mt-0">
        {logos.map((Logo, index) => (
          <div
            key={index}
            className="relative h-full w-fit mx-[4rem] flex items-center justify-start"
          >
            <Logo />
          </div>
        ))}
      </Marquee>
    </div>
  )
}
