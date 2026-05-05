import { GoogleAPIConnector } from './GoogleAPIConnector';

export interface TreatmentQuest {
    id: string;
    title: string;
    description: string;
    category: 'Main Quest' | 'Side Quest' | 'Tech Quest';
    priority: 'Critical' | 'High' | 'Normal';
    reward_xp: number;
    status: 'Locked' | 'Active' | 'Completed';
    icon?: string;
}

export class SmartPlannerController {
    /**
     * Optimización extrema de contexto.
     * Reduce la información al mínimo absoluto necesario para mantener
     * los consumos de tokens en la capa estrictamente gratuita de Gemini API.
     */
    static optimizeContext(rawContext: any): string {
        const optimized = {
            c: rawContext?.chiefComplaint?.substring(0, 100) || "General",
            d: rawContext?.diagnoses?.map((d: any) => d.name).join(",").substring(0, 100) || "Ninguno",
            a: rawContext?.medicalAlerts?.length ? "SI" : "NO"
        };

        return `Actúa como dentista experto. Contexto: ${JSON.stringify(optimized)}. Genera 3 tareas. Devuelve SOLO un array JSON exacto con esta estructura: [{"id":"uuid","title":"Corto","description":"Breve explicacion","category":"Main Quest","priority":"Critical|High|Normal","reward_xp":100,"status":"Active","icon":"🦷"}]. No incluyas markdown, solo el array JSON bruto.`;
    }

    static async generateSmartPlan(clinicalContext: any): Promise<TreatmentQuest[]> {
        const optimizedPrompt = this.optimizeContext(clinicalContext);

        try {
            const rawResponse = await GoogleAPIConnector.generateTreatmentPlan(optimizedPrompt);
            const cleanJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            const quests: TreatmentQuest[] = JSON.parse(cleanJson);

            // Validate minimum structure and add default icons if missing
            return quests.map((q, idx) => ({
                ...q,
                id: q.id || `gen-${Date.now()}-${idx}`,
                icon: q.icon || (q.category === 'Main Quest' ? '🎯' : '✨')
            }));
        } catch (error) {
            console.error("Planner AI Parsing Failed. Fallback engaged.", error);
            return [
                {
                    id: "err-fallback-1",
                    title: "Recalibración Requerida",
                    description: "El motor de IA no pudo procesar el plan. Operando en modo local seguro.",
                    category: "Tech Quest",
                    priority: "Critical",
                    reward_xp: 50,
                    status: "Active",
                    icon: "⚠️"
                }
            ];
        }
    }
}
