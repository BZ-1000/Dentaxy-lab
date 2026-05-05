import React, { createContext, useContext, useEffect, useState, useRef, useCallback, memo, useMemo } from "react";
import { Plus, Send, X } from "lucide-react";

// ===== TYPES =====

type MenuOption = string;

interface RippleEffect {
    x: number;
    y: number;
    id: number;
}

interface Position {
    x: number;
    y: number;
}

interface ChatInputProps {
    placeholder?: string;
    onSubmit?: (value: string) => void;
    /** Initial value for controlled input if needed, though component manages internal state mostly */
    initialValue?: string;
    /** OnChange callback to sync with parent form */
    onChange?: (value: string) => void;
    disabled?: boolean;
    glowIntensity?: number;
    expandOnFocus?: boolean;
    animationDuration?: number;
    textColor: string;
    backgroundOpacity?: number;
    showEffects?: boolean;
    /* Optional content to render inside the input area (e.g. VoiceInput) */
    endAdornment?: React.ReactNode;
    /* Whether to show the send button. Defaults to true if onSubmit is provided. */
    showSendButton?: boolean;
    menuOptions?: MenuOption[];
    className?: string;
}

interface InputAreaProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    disabled: boolean;
    isSubmitDisabled: boolean;
    textColor: string;
    endAdornment?: React.ReactNode;
    showSendButton: boolean;
}

interface GlowEffectsProps {
    glowIntensity: number;
    mousePosition: Position;
    animationDuration: number;
    enabled: boolean;
}

interface RippleEffectsProps {
    ripples: RippleEffect[];
    enabled: boolean;
}

interface MenuButtonProps {
    toggleMenu: () => void;
    menuRef: React.RefObject<HTMLDivElement>;
    isMenuOpen: boolean;
    onSelectOption: (option: MenuOption) => void;
    textColor: string;
    menuOptions: MenuOption[];
}

interface SelectedOptionsProps {
    options: MenuOption[];
    onRemove: (option: MenuOption) => void;
    textColor: string;
}

interface SendButtonProps {
    isDisabled: boolean;
    textColor: string;
}

interface OptionsMenuProps {
    isOpen: boolean;
    onSelect: (option: MenuOption) => void;
    textColor: string;
    menuOptions: MenuOption[];
}

interface OptionTagProps {
    option: MenuOption;
    onRemove: (option: MenuOption) => void;
    textColor: string;
}

// ===== CONTEXT =====

interface ChatInputContextProps {
    mousePosition: Position;
    ripples: RippleEffect[];
    addRipple: (x: number, y: number) => void;
    animationDuration: number;
    glowIntensity: number;
    textColor: string;
    showEffects: boolean;
}

const ChatInputContext = createContext<ChatInputContextProps | undefined>(undefined);

function useChatInputContext() {
    const context = useContext(ChatInputContext);
    if (context === undefined) {
        throw new Error("useChatInputContext must be used within a ChatInputProvider");
    }
    return context;
}

// ===== COMPONENTS =====

const SendButton = memo(({ disabled, textColor }: { disabled: boolean, textColor: string }) => {
    return (
        <button
            type="submit"
            aria-label="Send message"
            disabled={disabled}
            className={`ml-3 self-end mb-1 h-8 w-8 flex items-center justify-center rounded-full border-0 p-0 transition-all z-20 ${disabled
                ? 'opacity-40 cursor-not-allowed bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                : 'opacity-100 bg-black dark:bg-white text-white dark:text-black hover:scale-105 hover:shadow-lg'
                }`}
        >
            <Send size={14} className={disabled ? "opacity-50" : "opacity-100"} />
        </button>
    );
});

const OptionsMenu = memo(({ isOpen, onSelect, textColor, menuOptions }: OptionsMenuProps) => {
    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden z-50 min-w-[120px] animate-in slide-in-from-bottom-2 fade-in duration-200">
            <ul className="py-1">
                {menuOptions.map((option) => (
                    <li
                        key={option}
                        className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-colors"
                        onClick={() => onSelect(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
});

const OptionTag = memo(({ option, onRemove, textColor }: OptionTagProps) => (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300">
        <span>{option}</span>
        <button
            type="button"
            onClick={() => onRemove(option)}
            className="h-4 w-4 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
            <X size={10} />
        </button>
    </div>
));

const GlowEffects = memo(({ glowIntensity, mousePosition, animationDuration, enabled }: GlowEffectsProps) => {
    if (!enabled) return null;

    const transitionStyle = `transition-opacity duration-${animationDuration}`;

    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/60 to-white/40 dark:from-zinc-900/40 dark:via-zinc-900/60 dark:to-zinc-900/40 backdrop-blur-xl rounded-3xl pointer-events-none"></div>

            <div
                className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${transitionStyle} pointer-events-none`}
                style={{
                    boxShadow: `
            0 0 0 1px rgba(16, 185, 129, ${0.1 * glowIntensity}), 
            0 0 8px rgba(16, 185, 129, ${0.1 * glowIntensity})
          `,
                }}
            ></div>

            <div
                className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 ${transitionStyle} pointer-events-none`}
                style={{
                    boxShadow: `0 0 20px rgba(16, 185, 129, ${0.1 * glowIntensity})`,
                }}
            ></div>

            <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(circle 100px at ${mousePosition.x}% ${mousePosition.y}%, rgba(16,185,129,0.15), transparent 100%)`,
                }}
            ></div>
        </>
    );
});

const RippleEffects = memo(({ ripples, enabled }: RippleEffectsProps) => {
    if (!enabled || ripples.length === 0) return null;

    return (
        <>
            {ripples.map((ripple) => (
                <div
                    key={ripple.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: ripple.x - 20,
                        top: ripple.y - 20,
                        width: 40,
                        height: 40,
                    }}
                >
                    <div className="w-full h-full rounded-full bg-emerald-500/10 animate-ping"></div>
                </div>
            ))}
        </>
    );
});

const InputArea = memo(({ value, setValue, placeholder, handleKeyDown, disabled, isSubmitDisabled, textColor, endAdornment, showSendButton }: InputAreaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 120;
            textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
        }
    }, [value]);

    return (
        <div className="flex-1 relative flex items-center">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="w-full bg-transparent text-sm font-normal text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 border-0 outline-none px-3 py-3 resize-none custom-scrollbar"
                disabled={disabled}
            />
            {endAdornment && <div className="ml-1 mb-1 self-end relative z-20">{endAdornment}</div>}
            {showSendButton && <SendButton disabled={isSubmitDisabled} textColor={textColor} />}
        </div>
    );
});

const MenuButton = memo(({ toggleMenu, menuRef, isMenuOpen, onSelectOption, textColor, menuOptions }: MenuButtonProps) => (
    <div className="relative self-end mb-1 ml-1" ref={menuRef}>
        <button
            type="button"
            onClick={toggleMenu}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-all"
        >
            <Plus size={18} />
        </button>
        <OptionsMenu isOpen={isMenuOpen} onSelect={onSelectOption} textColor={textColor} menuOptions={menuOptions} />
    </div>
));

const SelectedOptions = memo(({ options, onRemove, textColor }: SelectedOptionsProps) => {
    if (options.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 px-3 pb-2 z-20 relative">
            {options.map((option) => (
                <OptionTag key={option} option={option} onRemove={onRemove} textColor={textColor} />
            ))}
        </div>
    );
});

export default function AdvancedChatInput({
    placeholder = "Escribe aquí...",
    onSubmit,
    initialValue = "",
    onChange,
    disabled = false,
    glowIntensity = 0.6,
    expandOnFocus = true,
    animationDuration = 300,
    textColor = "#000000",
    backgroundOpacity = 0.8,
    showEffects = true,
    menuOptions = ["Dolor Agudo", "Crónico", "Punzante", "Sordo"], // Customized default options
    endAdornment,
    showSendButton,
    className
}: ChatInputProps) {
    const [value, setValue] = useState(initialValue);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
    const [ripples, setRipples] = useState<RippleEffect[]>([]);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 50, y: 50 });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const throttleRef = useRef<number | null>(null);

    // Sync internal state if initialValue changes externally
    useEffect(() => {
        if (initialValue !== undefined && initialValue !== value) {
            setValue(initialValue);
        }
    }, [initialValue]);

    // Propagate changes
    useEffect(() => {
        if (onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && onSubmit && !disabled) {
            onSubmit(value.trim());
            // Don't auto-clear if it's a form field, assume parent handles clearing if needed
            // Actually usually inputs clear on submit in chat, but here it's likely a persistent field.
            // IF onSubmit acts as "Enter", maybe we keep it? 
            // The snippet cleared it. But for a "Padecimiento Actual" inputs usually stay.
            // I will make it NOT clear by default for this use-case, unless user wants.
            // Wait, "SendButton" implies sending.
            // Let's assume it should clear if it's treated as a message. 
            // User asked to replace Textareas.
            // If I use this for "Motivo de Consulta", it should persist.
            // So I will NOT clear.
        }
    }, [value, onSubmit, disabled]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    }, [handleSubmit]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!showEffects) return;
        if (containerRef.current && !throttleRef.current) {
            throttleRef.current = window.setTimeout(() => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setMousePosition({ x, y });
                }
                throttleRef.current = null;
            }, 50);
        }
    }, [showEffects]);

    const addRipple = useCallback((x: number, y: number) => {
        if (!showEffects) return;
        if (ripples.length < 5) {
            const newRipple = { x, y, id: Date.now() };
            setRipples(prev => [...prev, newRipple]);
            setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 600);
        }
    }, [ripples, showEffects]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            addRipple(e.clientX - rect.left, e.clientY - rect.top);
        }
    }, [addRipple]);

    const contextValue = useMemo(() => ({
        mousePosition, ripples, addRipple, animationDuration, glowIntensity, textColor, showEffects
    }), [mousePosition, ripples, addRipple, animationDuration, glowIntensity, textColor, showEffects]);

    return (
        <ChatInputContext.Provider value={contextValue}>
            <div
                className={`w-full max-w-full relative group ${className}`}
            >
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    className="relative flex flex-col w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-1 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/30"
                >
                    <GlowEffects glowIntensity={glowIntensity} mousePosition={mousePosition} animationDuration={animationDuration} enabled={showEffects} />
                    <RippleEffects ripples={ripples} enabled={showEffects} />

                    <div className="flex items-end relative z-20">
                        <MenuButton
                            toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                            menuRef={menuRef}
                            isMenuOpen={isMenuOpen}
                            onSelectOption={(opt) => setSelectedOptions([...selectedOptions, opt])}
                            textColor={textColor}
                            menuOptions={menuOptions}
                        />
                        <InputArea
                            value={value}
                            setValue={setValue}
                            placeholder={placeholder}
                            handleKeyDown={handleKeyDown}
                            disabled={disabled}
                            isSubmitDisabled={disabled || !value.trim()}
                            textColor={textColor}
                            endAdornment={endAdornment}
                            showSendButton={showSendButton !== undefined ? showSendButton : !!onSubmit}
                        />
                    </div>

                    <SelectedOptions options={selectedOptions} onRemove={(opt) => setSelectedOptions(prev => prev.filter(o => o !== opt))} textColor={textColor} />
                </div>
            </div>
        </ChatInputContext.Provider>
    );
}
