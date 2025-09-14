import * as React from "react";
import { Frequency } from "@/lib/money";

interface Props {
  value: Frequency;
  onChange: (v: Frequency) => void;
}

export const FrequencyTabs: React.FC<Props> = ({ value, onChange }) => {
  const Tab = ({ id, label }: { id: Frequency; label: string }) => {
    const active = value === id;
    return (
      <button
        onClick={() => onChange(id)}
        className={[
          "flex-1 text-sm font-medium px-4 py-2 transition rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-primary hover:bg-primary/10",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="flex rounded-[12px] border border-primary/40 p-1 bg-card">
        <Tab id="weekly" label="Weekly" />
        <div className="w-px bg-border my-1" />
        <Tab id="monthly" label="Monthly" />
        <div className="w-px bg-border my-1" />
        <Tab id="annually" label="Annually" />
      </div>
    </div>
  );
};
