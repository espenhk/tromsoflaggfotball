import { TEAM_COLORS } from "@/lib/imageLibrary";

export const ColorPickerField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
}) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <div className="flex flex-wrap gap-1.5">
      {TEAM_COLORS.map(([hex, name]) => (
        <button
          key={hex}
          type="button"
          title={name}
          onClick={() => onChange(hex)}
          style={{ background: hex }}
          className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
            (value ?? "").toLowerCase() === hex.toLowerCase()
              ? "border-foreground ring-2 ring-primary/40"
              : "border-border"
          }`}
        />
      ))}
    </div>
    <input
      type="text"
      value={value ?? ""}
      placeholder="#54c59e"
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md bg-background border border-border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </label>
);

export default ColorPickerField;
