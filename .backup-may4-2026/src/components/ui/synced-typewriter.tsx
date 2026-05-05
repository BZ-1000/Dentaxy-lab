"use client";
import React from "react";
import { useTypewriterSync } from "@/contexts/TypewriterSyncContext";

interface SyncedTypewriterProps {
  className?: string;
}

export const SyncedTypewriter = ({ className }: SyncedTypewriterProps) => {
  const { displayText } = useTypewriterSync();

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
