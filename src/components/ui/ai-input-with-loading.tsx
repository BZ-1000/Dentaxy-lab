import { Mic, ChevronDown, ChevronUp } from "lucide-react";
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
    /** Elemento de sugerencia personalizado para colocar al inicio de la lista de completado */
    renderCustomFirstSuggestion?: React.ReactNode;
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
    contextSuggestions = [],
    renderCustomFirstSuggestion
}: AIInputWithLoadingProps) {
    // Use internal state if value is not provided (uncontrolled mode), otherwise sync with prop
    const [internalValue, setInternalValue] = useState(value || "");
    const [showAllStarters, setShowAllStarters] = useState(false);
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);

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

    // Si se pasa la prop contextSuggestions, usarla estrictamente. No caer al fallback genérico si fue provista.
    const activeSuggestions = contextSuggestions !== undefined ? contextSuggestions : getFilteredSuggestions(valStr);
    const showStarters = (valStr === "" || starterPhrases.some(p => p.trim() === valStr.trim())) && starterPhrases.length > 0;
    // Con contextSuggestions: mostrar siempre (incluso cuando el valor es solo el prefijo)
    // Sin contextSuggestions: mostrar solo cuando hay texto más allá del prefijo
    const showContextSuggestionsAlways = activeSuggestions.length > 0;
    const hasContentBeyondPrefix = protectedPrefix ? valStr.length > protectedPrefix.length : valStr !== "";
    const showSuggestionsList = !showStarters && activeSuggestions.length > 0 && (showContextSuggestionsAlways || hasContentBeyondPrefix);

    return (
        <div className="w-full py-2">
            <div className="relative w-full mx-auto">
                <Textarea
                    id={id}
                    placeholder={placeholder}
                    className={cn(
                        "w-full pl-5 pr-14 py-4 text-xl font-medium resize-none leading-relaxed",
                        "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-3xl",
                        "transition-all duration-200 outline-none focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                        "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                        "text-zinc-900 dark:text-zinc-100 shadow-sm",
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
                            "rounded-full p-2.5 transition-all duration-300 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm",
                            isRecording
                                ? "bg-red-50 text-red-500 scale-110 shadow-md border-red-200"
                                : "bg-zinc-50 text-zinc-500 hover:text-black hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
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
                    className="mt-3 flex flex-wrap gap-3 px-2 animate-in fade-in duration-300 items-center"
                >
                    <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 self-center uppercase tracking-widest mr-1">Iniciar frase:</span>
                    {(showAllStarters ? starterPhrases : starterPhrases.slice(0, 5)).map((phrase) => {
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
                                    "text-sm px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5",
                                    isSelected
                                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border border-zinc-900 dark:border-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] font-bold scale-[0.98]"
                                        : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-[4px_4px_10px_rgba(0,0,0,0.09),-3px_-3px_8px_rgba(255,255,255,1)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),-3px_-3px_8px_rgba(255,255,255,0.05)] hover:border-zinc-400 hover:shadow-[6px_6px_14px_rgba(0,0,0,0.13),-4px_-4px_10px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-[0.97] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1)] font-bold"
                                )
                            }
                            >
                                {isSelected && <span className="text-xs font-black text-[#111113] dark:text-white">✓</span>}
                                <span>{phrase.trim()}...</span>
                            </button>
                        );
                    })}
                    {starterPhrases.length > 5 && (
                        <button
                            type="button"
                            onClick={() => setShowAllStarters(!showAllStarters)}
                            className="text-xs font-bold px-4 py-2.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-[4px_4px_10px_rgba(0,0,0,0.09),-3px_-3px_8px_rgba(255,255,255,1)] hover:border-zinc-400 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                            {showAllStarters ? (
                                <>
                                    <span>Ver menos</span>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </>
                            ) : (
                                <>
                                    <span>+{starterPhrases.length - 5} más</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Sugerencias de Autocompletado contextuales */}
            {(showSuggestionsList || renderCustomFirstSuggestion) && (
                <div
                    className="mt-3 flex flex-wrap gap-3 px-2 animate-in fade-in duration-300 items-center"
                >
                    <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 self-center uppercase tracking-widest mr-1">Completar:</span>
                    {renderCustomFirstSuggestion}
                    {showSuggestionsList && (
                        (showAllSuggestions ? activeSuggestions : activeSuggestions.slice(0, 5)).map((suggestion) => {
                            const isSuggestionSelected = valStr.toLowerCase().includes(suggestion.toLowerCase());
                            return (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectSuggestion(suggestion);
                                    }}
                                    className={cn(
                                        "text-sm px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5",
                                        isSuggestionSelected
                                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border border-zinc-900 dark:border-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] font-bold scale-[0.98]"
                                            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-[4px_4px_10px_rgba(0,0,0,0.09),-3px_-3px_8px_rgba(255,255,255,1)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),-3px_-3px_8px_rgba(255,255,255,0.05)] hover:border-zinc-400 hover:shadow-[6px_6px_14px_rgba(0,0,0,0.13),-4px_-4px_10px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-[0.97] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1)] font-bold"
                                    )}
                                >
                                    {isSuggestionSelected ? <span className="text-xs font-black text-[#111113] dark:text-white">✓</span> : <span>+</span>}
                                    <span>{suggestion}</span>
                                </button>
                            );
                        })
                    )}
                    {showSuggestionsList && activeSuggestions.length > 5 && (
                        <button
                            type="button"
                            onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                            className="text-xs font-bold px-4 py-2.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-[4px_4px_10px_rgba(0,0,0,0.09),-3px_-3px_8px_rgba(255,255,255,1)] hover:border-zinc-400 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                            {showAllSuggestions ? (
                                <>
                                    <span>Ver menos</span>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </>
                            ) : (
                                <>
                                    <span>+{activeSuggestions.length - 5} más</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
