import * as React from "react";
import { Frequency } from "@/lib/money";

interface Props {
  value: Frequency;
  onChange: (v: Frequency) => void;
  className?: string;
}

export const FrequencyTabs: React.FC<Props> = ({ value, onChange }) => {
  const Tab = ({ id, label }: { id: Frequency; label: string }) => {
    const active = value === id;
    return (
      <button
        onClick={() => onChange(id)}
        className={[
          "flex-1 w-1/3 text-sm font-medium px-4 py-2 transition rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-primary text-primary-foreground shadow-sm dark:bg-white dark:text-primary"
            : "text-primary hover:bg-primary/10 dark:text-white dark:hover:bg-white/10",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="flex rounded-[12px] border border-primary/40 p-1 bg-card dark:bg-gray-800">
        <Tab id="weekly" label="Weekly" />
        <Tab id="monthly" label="Monthly" />
        <Tab id="annually" label="Annually" />
      </div>
    </div>
  );
};
