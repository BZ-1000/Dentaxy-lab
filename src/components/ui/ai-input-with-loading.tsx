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
        <div className="w-full py-2">
            <div className="relative w-full mx-auto">
                <Textarea
                    id={id}
                    placeholder={placeholder}
                    className={cn(
                        "w-full rounded-3xl pl-6 pr-14 py-6",
                        "bg-white/80 dark:bg-zinc-800/60 backdrop-blur-md shadow-sm", // Glassmorphic background
                        "border border-white/80 dark:border-white/10", // Glass border
                        "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                        "text-xl font-medium text-zinc-900 dark:text-zinc-100 resize-none leading-relaxed",
                        // NEUTRAL FOCUS RING
                        "focus:ring-4 focus:ring-black/5 dark:focus:ring-white/10 focus:border-black/20 dark:focus:border-white/20 focus:bg-white/90 dark:focus:bg-zinc-800/80",
                        "transition-all duration-300",
                        className
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
