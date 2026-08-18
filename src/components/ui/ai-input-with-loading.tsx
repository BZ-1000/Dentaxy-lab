import { Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { motion, AnimatePresence } from "framer-motion";

interface AIInputWithLoadingProps {
    id?: string;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    /** Optional value for controlled component pattern */
    value?: string;
    /** Optional onChange for controlled component pattern */
    onChange?: (value: string) => void;
    className?: string;
    autoFocus?: boolean;
    starterPhrases?: string[];
    suggestions?: string[];
    /** Prefijo protegido: no se puede borrar más allá de este texto */
    protectedPrefix?: string;
    /** Sugerencias de completado específicas para el contexto del campo */
    contextSuggestions?: string[];
}

export function AIInputWithLoading({
    id = "ai-input-with-loading",
    placeholder = "Escribe aquí...",
    minHeight = 56,
    maxHeight = 200,
    value,
    onChange,
    className,
    autoFocus = false,
    starterPhrases = [],
    suggestions = [],
    protectedPrefix,
    contextSuggestions = []
}: AIInputWithLoadingProps) {
    // Use internal state if value is not provided (uncontrolled mode), otherwise sync with prop
    const [internalValue, setInternalValue] = useState(value || "");

    // Voice Recognition Logic
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight,
        maxHeight,
    });

    // Sync with prop changes for controlled mode
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
            // We adjust height on next tick to ensure content is rendered
            requestAnimationFrame(() => adjustHeight());
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        // Proteger el prefijo: si hay un prefijo protegido, no permitir borrar más allá de él
        if (protectedPrefix && val.length < protectedPrefix.length) {
            // Restaurar al prefijo mínimo
            setInternalValue(protectedPrefix);
            adjustHeight();
            onChange?.(protectedPrefix);
            return;
        }
        setInternalValue(val);
        adjustHeight();
        onChange?.(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!protectedPrefix) return;
        const currentVal = typeof internalValue === 'string' ? internalValue : '';
        // Bloquear Backspace cuando el texto es exactamente el prefijo
        if ((e.key === 'Backspace' || e.key === 'Delete') && currentVal.length <= protectedPrefix.length) {
            e.preventDefault();
        }
    };

    // --- Voice Logic Simplification ---
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecording = () => {
        if (typeof window === 'undefined') return;

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.error("Speech recognition not supported");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.lang = 'es-MX'; // Mexican Spanish specifically
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                if (lastResult.isFinal) {
                    const transcript = lastResult[0].transcript;
                    const newValue = internalValue + (internalValue && !internalValue.endsWith(' ') ? " " : "") + transcript;
                    setInternalValue(newValue);
                    adjustHeight();
                    onChange?.(newValue);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
            setIsRecording(true);
        } catch (err) {
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // --- Sugerencias Inteligentes Dinámicas ---
    const getFilteredSuggestions = (val: string) => {
        if (!val || val.trim() === "") return [];

        // Base de datos de autocompletado odontológico común
        const clinicalDatabase = [
            // Dolor / Molestia
            { keywords: ["dol", "mol", "dolor", "molestia", "duele", "mal"], text: "dolor agudo al masticar" },
            { keywords: ["dol", "mol", "dolor", "molestia", "duele", "mal"], text: "dolor intenso en la muela" },
            { keywords: ["dol", "mol", "dolor", "molestia", "duele", "mal"], text: "dolor pulsátil persistente" },
            { keywords: ["dol", "mol", "dolor", "molestia", "duele", "mal"], text: "molestia en la encía al cepillarse" },
            { keywords: ["dol", "mol", "dolor", "molestia", "duele", "mal"], text: "dolor al consumir alimentos fríos" },
            { keywords: ["dol", "mol", "dolor", "molestia", "duele", "mal"], text: "dolor al consumir alimentos calientes" },

            // Limpieza / Profilaxis
            { keywords: ["lim", "pro", "limp", "profi", "tarta"], text: "limpieza dental de rutina" },
            { keywords: ["lim", "pro", "limp", "profi", "tarta"], text: "limpieza profunda (profilaxis)" },
            { keywords: ["lim", "pro", "limp", "profi", "tarta"], text: "limpieza general y aplicación de flúor" },

            // Sensibilidad
            { keywords: ["sen", "fri", "cal", "sensi"], text: "sensibilidad al frío y al calor" },
            { keywords: ["sen", "fri", "cal", "sensi"], text: "sensibilidad dental en dientes frontales" },
            { keywords: ["sen", "fri", "cal", "sensi"], text: "sensibilidad persistente al comer dulce" },

            // Sangrado
            { keywords: ["san", "gin", "sang", "enc"], text: "sangrado de encías al cepillarse" },
            { keywords: ["san", "gin", "sang", "enc"], text: "sangrado gingival espontáneo" },
            { keywords: ["san", "gin", "sang", "enc"], text: "sangrado e inflamación de encías" },

            // Revisión / Chequeo
            { keywords: ["rev", "che", "revi", "vis"], text: "revisión general de caries" },
            { keywords: ["rev", "che", "revi", "vis"], text: "revisión periódica de rutina" },
            { keywords: ["rev", "che", "revi", "vis"], text: "chequeo dental semestral" },

            // Pérdida / Caída
            { keywords: ["per", "cai", "perd", "rot", "rom"], text: "pérdida de una resina" },
            { keywords: ["per", "cai", "perd", "rot", "rom"], text: "pérdida de una corona dental" },
            { keywords: ["per", "cai", "perd", "rot", "rom"], text: "caída de un diente" },
            { keywords: ["per", "cai", "perd", "rot", "rom"], text: "fractura de una pieza dental" },

            // Tratamiento
            { keywords: ["tra", "end", "ort", "trata", "res"], text: "tratamiento de endodoncia" },
            { keywords: ["tra", "end", "ort", "trata", "res"], text: "tratamiento de ortodoncia" },
            { keywords: ["tra", "end", "ort", "trata", "res"], text: "tratamiento de caries múltiples" }
        ];

        const searchTerms = val.toLowerCase().split(/\s+/);
        const matches = clinicalDatabase.filter(item =>
            searchTerms.some(term =>
                term.length >= 2 && item.keywords.some(keyword => keyword.startsWith(term) || term.startsWith(keyword))
            )
        );

        // Retornar hasta 4 opciones únicas
        return Array.from(new Set(matches.map(m => m.text))).slice(0, 4);
    };

    const valStr = typeof internalValue === "string" ? internalValue : "";

    const handleSelectPhrase = (phrase: string) => {
        let newValue = phrase;
        setInternalValue(newValue);
        onChange?.(newValue);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handleSelectSuggestion = (suggestionText: string) => {
        let newValue = suggestionText;

        const valStr = typeof internalValue === "string" ? internalValue : "";
        // Si hay un prefijo protegido activo, combinar prefijo + sugerencia
        if (protectedPrefix) {
            newValue = protectedPrefix + suggestionText;
        } else {
            // Si ya hay un inicio de frase elegido, lo combinamos de forma natural
            const activeStarter = starterPhrases.find(p => valStr.startsWith(p));
            if (activeStarter) {
                newValue = activeStarter + suggestionText;
            }
        }

        setInternalValue(newValue);
        onChange?.(newValue);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    // Si hay contextSuggestions específicas, usarlas en lugar de la base de datos genérica
    const activeSuggestions = contextSuggestions.length > 0 ? contextSuggestions : getFilteredSuggestions(valStr);
    const showStarters = (valStr === "" || starterPhrases.some(p => p.trim() === valStr.trim())) && starterPhrases.length > 0;
    // Con contextSuggestions: mostrar siempre (incluso cuando el valor es solo el prefijo)
    // Sin contextSuggestions: mostrar solo cuando hay texto más allá del prefijo
    const showContextSuggestionsAlways = contextSuggestions.length > 0;
    const hasContentBeyondPrefix = protectedPrefix ? valStr.length > protectedPrefix.length : valStr !== "";
    const showSuggestionsList = !showStarters && activeSuggestions.length > 0 && (showContextSuggestionsAlways || hasContentBeyondPrefix);

    return (
        <div className="w-full py-2">
            <div className="relative w-full mx-auto">
                <Textarea
                    id={id}
                    placeholder={placeholder}
                    className={cn(
                        "w-full pl-2 pr-14 py-4 text-xl font-medium resize-none leading-relaxed",
                        "bg-transparent border-0 shadow-none focus-visible:ring-0 focus:ring-0 outline-none",
                        "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                        "text-zinc-900 dark:text-zinc-100",
                        className
                    )}
                    style={{ minHeight: `${minHeight}px` }}
                    ref={textareaRef}
                    value={internalValue || ""}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus={autoFocus}
                />

                {/* Single Microphone Action */}
                <div className="absolute right-3 bottom-3 flex items-center">
                    <button
                        onClick={toggleRecording}
                        className={cn(
                            "rounded-full p-2.5 transition-all duration-300 flex items-center justify-center",
                            isRecording
                                ? "bg-red-50 text-red-500 scale-110 shadow-sm"
                                : "text-gray-400 hover:text-black hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                        type="button"
                        title={isRecording ? "Detener grabación" : "Iniciar dictado"}
                    >
                        <Mic className={cn("w-5 h-5", isRecording && "animate-pulse")} />
                    </button>
                </div>
            </div>

            {/* Píldoras de Recomendación Inteligente (Starter Phrases) */}
            {showStarters && (
                <div
                    className="mt-3 flex flex-wrap gap-2 px-2 animate-in fade-in duration-300"
                >
                    <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 self-center uppercase tracking-widest mr-1">Iniciar frase:</span>
                    {starterPhrases.map((phrase) => {
                        const isSelected = valStr.startsWith(phrase);
                        return (
                            <button
                                key={phrase}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectPhrase(phrase);
                                }}
                                className={cn(
                                    "text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm border transition-all duration-300 hover:scale-105",
                                    isSelected
                                        ? "bg-zinc-900 text-white border-transparent dark:bg-white dark:text-zinc-900"
                                        : "bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-800/60"
                                )}
                            >
                                {phrase.trim()}...
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Sugerencias de Autocompletado contextuales */}
            {showSuggestionsList && (
                <div
                    className="mt-3 flex flex-wrap gap-2 px-2 animate-in fade-in duration-300"
                >
                    <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 self-center uppercase tracking-widest mr-1">Completar:</span>
                    {activeSuggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                            }}
                            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-200 transition-all duration-300 hover:scale-105 shadow-sm"
                        >
                            + {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
