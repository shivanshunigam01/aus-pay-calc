import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const NumberInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  className,
}: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange(Number.isFinite(val) ? val : 0);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select the entire value on focus so first keystroke replaces it (goodbye leading “0” problem)
    // rAF ensures selection happens after the browser places the caret.
    requestAnimationFrame(() => e.currentTarget.select());
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    // Prevent accidental scroll-step changes on desktop
    e.currentTarget.blur();
  };

  return (
    <div className="space-y-2">
      {label ? (
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      ) : null}

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}

        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onWheel={handleWheel}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`${prefix ? "pl-8" : ""} ${suffix ? "pr-12" : ""} ${
            className || ""
          }`}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
