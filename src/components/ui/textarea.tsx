
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  chatAnimation?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, chatAnimation = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [animatedText, setAnimatedText] = React.useState<string>('');
    const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
    const animationRef = React.useRef<any>(null);

    // Set up the combined ref
    const setRefs = React.useCallback((element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    }, [ref]);

    // Function to animate text typing
    const animateTyping = React.useCallback((text: string) => {
      if (!chatAnimation) return;
      
      let i = 0;
      setAnimatedText('');
      setIsAnimating(true);
      
      const speed = Math.max(10, 100 / (text.length / 100)); // Adjust speed based on text length
      
      clearInterval(animationRef.current);
      
      animationRef.current = setInterval(() => {
        if (i < text.length) {
          setAnimatedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(animationRef.current);
          setIsAnimating(false);
        }
      }, speed);
    }, [chatAnimation]);

    // Watch for value changes to trigger animation
    React.useEffect(() => {
      if (chatAnimation && props.value && typeof props.value === 'string' && !isAnimating) {
        animateTyping(props.value);
      }
    }, [props.value, chatAnimation, animateTyping, isAnimating]);

    // Clean up animation on unmount
    React.useEffect(() => {
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }, []);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-justify",
          className
        )}
        ref={setRefs}
        {...props}
        value={chatAnimation && isAnimating ? animatedText : props.value}
        // Prevent automatic focus scrolling behavior
        onFocus={(e) => {
          // Call the original onFocus if it exists
          if (props.onFocus) {
            props.onFocus(e);
          }
          // Prevent scroll jumping
          e.currentTarget.scrollIntoView({ behavior: 'auto', block: 'center' });
        }}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
