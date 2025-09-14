import {
  RadioGroup as UIRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  value: string;
  label: string;
}
interface RadioGroupProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
}

export const RadioGroup = ({
  id,
  label,
  value,
  onChange,
  options,
}: RadioGroupProps) => {
  return (
    <div className="space-y-3">
      {label ? (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      ) : null}
      <UIRadioGroup
        value={value}
        onValueChange={onChange}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label
              htmlFor={`${id}-${option.value}`}
              className="text-sm text-foreground"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </UIRadioGroup>
    </div>
  );
};
