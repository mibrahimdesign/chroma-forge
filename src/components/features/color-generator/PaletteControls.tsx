import { GenerationMode } from "@/lib/color/engine";

interface PaletteControlsProps {
  mode: GenerationMode;
  namingPrefix: string;
  onModeChange: (mode: GenerationMode) => void;
  onPrefixChange: (prefix: string) => void;
}

export function PaletteControls({ mode, namingPrefix, onModeChange, onPrefixChange }: PaletteControlsProps) {
  
  const modes: { value: GenerationMode; label: string; desc: string }[] = [
    { value: "tailwind", label: "Tailwind-like", desc: "Balanced standard scale" },
    { value: "perceptual", label: "Perceptual", desc: "Linear brightness steps" },
    { value: "vivid", label: "Vivid", desc: "Higher saturation" },
    { value: "muted", label: "Muted", desc: "Lower saturation, subtle darks" },
  ];

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic validation, prevent dangerous XSS payload injection via state.
    const val = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "");
    onPrefixChange(val);
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight">Configuration</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Generation Algorithm</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all ${
                mode === m.value 
                  ? "border-foreground bg-foreground/5 ring-1 ring-foreground" 
                  : "bg-transparent hover:bg-muted"
              }`}
            >
              <span className="text-sm font-semibold">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Class Prefix (e.g. primary)</label>
        <input
          type="text"
          value={namingPrefix}
          onChange={handlePrefixChange}
          placeholder="primary"
          maxLength={20}
          className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm font-medium outline-none shadow-sm focus-within:ring-2 focus-within:ring-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
