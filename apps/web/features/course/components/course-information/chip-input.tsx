"use client";

import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useRef, useState } from "react";

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ChipInput: React.FC<ChipInputProps> = ({
  value,
  onChange,
  placeholder = "Type & Enter...",
  className,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      e.preventDefault();
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-2 rounded-lg border border-input bg-input/30 px-3 py-2 text-sm ring-offset-background transition-all",
        isFocused && "border-transparent ring-2 ring-ring ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        "h-auto min-h-10",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <AnimatePresence mode="popLayout">
        {value.map((tag, index) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="group flex items-center gap-1 rounded-full border bg-secondary/60 py-0.5 pr-1 pl-2.5 font-medium text-secondary-foreground text-xs transition-colors hover:bg-secondary"
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
            initial={{ opacity: 0, scale: 0.8 }}
            key={tag}
            layout
          >
            <span>{tag}</span>
            <button
              className="grid size-4 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              type="button"
            >
              <X className="size-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <input
        className="min-w-24 flex-1 bg-transparent py-0.5 outline-hidden placeholder:text-muted-foreground"
        disabled={disabled}
        onBlur={() => setIsFocused(false)}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleInputKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        ref={inputRef}
        type="text"
        value={inputValue}
      />
    </div>
  );
};

export default ChipInput;
