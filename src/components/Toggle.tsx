import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({ id, label, checked, onChange, disabled }: ToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};