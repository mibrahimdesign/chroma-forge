import { useCallback, useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { safeParseColor } from "@/lib/color/engine";

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorInput({ value, onChange }: ColorInputProps) {
  const [inputVal, setInputVal] = useState(value);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setInputVal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputVal(newVal);
    
    // Only fire onChange if it's a strongly valid color to prevent flickering/crashing
    const c = safeParseColor(newVal);
    if (c) {
      onChange(c.toHex());
    }
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Base Color</label>
      <div className="group relative flex items-center rounded-lg border bg-card px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-foreground">
        
        {/* Native color picker masked behind icon */}
        <div className="relative mr-3 h-6 w-6 shrink-0 overflow-hidden rounded-md border shadow-sm">
          <input
            type="color"
            value={safeParseColor(value)?.toHex() || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 block h-10 w-10 cursor-pointer appearance-none bg-transparent border-0 p-0"
          />
        </div>

        <input
          type="text"
          value={inputVal}
          onChange={handleChange}
          placeholder="#3b82f6"
          className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
          spellCheck={false}
          autoComplete="off"
        />

        <button
          onClick={handleCopy}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Copy to clipboard"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
