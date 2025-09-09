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
          "flex-1 text-sm font-medium px-4 py-2 transition",
          active
            ? "bg-primary text-white shadow-sm"
            : "text-primary hover:bg-primary/10",
          "rounded-[10px]",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="flex rounded-[12px] border border-primary/40 p-1 bg-white">
        <Tab id="weekly" label="Weekly" />
        <div className="w-[1px] bg-primary/15 my-1" />
        <Tab id="monthly" label="Monthly" />
        <div className="w-[1px] bg-primary/15 my-1" />
        <Tab id="annually" label="Annually" />
      </div>
    </div>
  );
};
