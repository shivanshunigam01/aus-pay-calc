import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Frequency } from "@/lib/money";

interface FrequencyTabsProps {
  value: Frequency;
  onChange: (value: Frequency) => void;
}

export const FrequencyTabs = ({ value, onChange }: FrequencyTabsProps) => {
  return (
    <Tabs value={value} onValueChange={onChange as (value: string) => void}>
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
        <TabsTrigger value="weekly" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary">Weekly</TabsTrigger>
        <TabsTrigger value="monthly" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary">Monthly</TabsTrigger>
        <TabsTrigger value="annually" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary">Annually</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};