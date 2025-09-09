import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Frequency } from "@/lib/money";

interface FrequencyTabsProps {
  value: Frequency;
  onChange: (value: Frequency) => void;
}

export const FrequencyTabs = ({ value, onChange }: FrequencyTabsProps) => {
  return (
    <Tabs value={value} onValueChange={onChange as (value: string) => void}>
      <TabsList className="grid w-full grid-cols-3 bg-muted">
        <TabsTrigger value="weekly" className="text-sm">Weekly</TabsTrigger>
        <TabsTrigger value="monthly" className="text-sm">Monthly</TabsTrigger>
        <TabsTrigger value="annually" className="text-sm">Annually</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};