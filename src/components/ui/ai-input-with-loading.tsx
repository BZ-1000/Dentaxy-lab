"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

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
}

export function AIInputWithLoading({
    id = "ai-input-with-loading",
    placeholder = "Escribe aquí...",
    minHeight = 56,
    maxHeight = 200,
    value,
    onChange,
    className,
    autoFocus = false
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
        setInternalValue(val);
        adjustHeight();
        onChange?.(val);
    };

    // --- Voice Logic Simplification ---
    // (Kept robust but minimal)
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
                    // Append with space if needed
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

    return (
        <div className={cn("w-full py-2", className)}>
            <div className="relative w-full mx-auto">
                <Textarea
                    id={id}
                    placeholder={placeholder}
                    className={cn(
                        "w-full rounded-2xl pl-5 pr-12 py-4",
                        "bg-white dark:bg-zinc-800/50", // Flat, clean background
                        "border border-gray-200 dark:border-zinc-700", // Subtle border
                        "placeholder:text-gray-400 dark:placeholder:text-zinc-500",
                        "text-gray-900 dark:text-zinc-100 resize-none leading-relaxed",
                        // NEUTRAL FOCUS RING (Black/Gray): No green saturation
                        "focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 focus:border-black/50 dark:focus:border-white/50",
                        "transition-all duration-200"
                    )}
                    style={{ minHeight: `${minHeight}px` }}
                    ref={textareaRef}
                    value={internalValue}
                    onChange={handleChange}
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
                                : "text-gray-400 hover:text-black hover:bg-black/5 dark:hover:bg-white/10" // Neutral hover
                        )}
                        type="button"
                        title={isRecording ? "Detener grabación" : "Iniciar dictado"}
                    >
                        <Mic className={cn("w-5 h-5", isRecording && "animate-pulse")} />
                    </button>
                </div>
            </div>
        </div>
    );
}
