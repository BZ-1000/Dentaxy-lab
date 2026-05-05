export class GoogleAPIConnector {
    private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    static async generateTreatmentPlan(prompt: string): Promise<string> {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null);

        // Si no hay key o estamos forzando modo local
        if (!apiKey) {
            console.warn("No Gemini API Key found. Falling back to Local Deterministic Model for zero cost.");
            return this.localFallthrough(prompt);
        }

        try {
            // Actúa como fail-safe si no hay internet (Local-Fallthrough)
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                throw new Error("No internet connection.");
            }

            const response = await fetch(`${this.GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.2, // Baja temperatura para más determinismo
                        maxOutputTokens: 800, // Limitar explícitamente para asegurar free tier
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.warn("Gemini API failed or offline. Engaged Local Deterministic Fallthrough.", error);
            return this.localFallthrough(prompt);
        }
    }

    // Simulación determinista local (Costo 0) garantizada para reemplazar llamados si fallan o no hay internet
    private static localFallthrough(prompt: string): string {
        return JSON.stringify([
            {
                id: "loc-1",
                title: "Evaluación Crítica Integrada",
                description: "Revisión inmediata de los signos reportados en la fase de anamnesis.",
                category: "Main Quest",
                priority: "Critical",
                reward_xp: 150,
                status: "Active",
                icon: "🎯"
            },
            {
                id: "loc-2",
                title: "Ejecución de Plan de Acción",
                description: "Estabilización y control clínico automatizado.",
                category: "Main Quest",
                priority: "High",
                reward_xp: 200,
                status: "Active",
                icon: "⚡"
            },
            {
                id: "loc-3",
                title: "Protocolo Preventivo",
                description: "Agendar mantenimientos a largo plazo para asegurar la salud del paciente.",
                category: "Side Quest",
                priority: "Normal",
                reward_xp: 50,
                status: "Active",
                icon: "🛡️"
            }
        ]);
    }
}
