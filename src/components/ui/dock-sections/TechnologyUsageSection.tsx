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
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            <Code2 size={14} />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            Tecnologías Utilizadas
          </h3>
        </div>

        <div className="space-y-3">
          {programmingLanguages.map((lang, idx) => (
            <div key={lang.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {lang.label}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {lang.percentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-2 rounded-full bg-primary"
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
