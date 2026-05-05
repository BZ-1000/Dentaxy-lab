import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code2 } from "lucide-react";

const programmingLanguages = [
  { label: "TypeScript", percentage: 35 },
  { label: "React/JSX", percentage: 28 },
  { label: "JavaScript", percentage: 15 },
  { label: "CSS/Tailwind", percentage: 12 },
  { label: "Dentaxy GPT", percentage: 8 },
  { label: "SQL", percentage: 2 },
];

export const TechnologyUsageSection = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/5 border-0 shadow-lg shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent backdrop-blur-xl" />
      
      <CardContent className="relative p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25">
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Tecnologías
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Stack técnico
            </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {programmingLanguages.map((lang, idx) => (
            <div key={lang.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground truncate">
                  {lang.label}
                </span>
                <span className="text-xs font-black text-foreground">
                  {lang.percentage}%
                </span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${lang.percentage}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
