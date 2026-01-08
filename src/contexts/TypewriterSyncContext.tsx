"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface TypewriterSyncContextType {
  currentSuffix: string;
  displayText: string;
  isTyping: boolean;
}

const TypewriterSyncContext = createContext<TypewriterSyncContextType>({
  currentSuffix: ".ai",
  displayText: ".ai",
  isTyping: false,
});

export const useTypewriterSync = () => useContext(TypewriterSyncContext);

const SUFFIXES = [".ai", ".com"];
const TYPING_SPEED = 100;
const DELETE_SPEED = 80;
const DELAY_BETWEEN = 12000;

export const TypewriterSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [suffixIndex, setSuffixIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  const currentSuffix = SUFFIXES[suffixIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (charIndex < currentSuffix.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentSuffix.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, TYPING_SPEED);
      } else {
        // Done typing, wait then delete
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsDeleting(true);
          setIsTyping(true);
        }, DELAY_BETWEEN);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, DELETE_SPEED);
      } else {
        // Done deleting, switch suffix
        setIsDeleting(false);
        setCharIndex(0);
        setSuffixIndex((prev) => (prev + 1) % SUFFIXES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, displayText, currentSuffix]);

  return (
    <TypewriterSyncContext.Provider value={{ currentSuffix, displayText, isTyping }}>
      {children}
    </TypewriterSyncContext.Provider>
  );
};
