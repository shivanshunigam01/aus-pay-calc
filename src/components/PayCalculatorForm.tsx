import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NumberInput } from "./NumberInput";
import { Toggle } from "./Toggle";
import { RadioGroup } from "./RadioGroup";
import { CalculationInputs, FinancialYear, Residency, MLReduction } from "@/lib/ausTax";
import { Frequency } from "@/lib/money";

interface PayCalculatorFormProps {
  inputs: CalculationInputs;
  onChange: (inputs: CalculationInputs) => void;
  onReset: () => void;
}

export const PayCalculatorForm = ({ inputs, onChange, onReset }: PayCalculatorFormProps) => {
  const updateInput = <K extends keyof CalculationInputs>(
    key: K,
    value: CalculationInputs[K]
  ) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <Card className="border-l-4 border-l-primary shadow-sm bg-white">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">Pay Calculator</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <NumberInput
            id="salary"
            label="Your salary*"
            value={inputs.salary}
            onChange={(value) => updateInput('salary', value)}
            prefix="$"
            placeholder="80,000"
          />
          
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">Frequency</Label>
            <Select 
              value={inputs.frequency} 
              onValueChange={(value: Frequency) => updateInput('frequency', value)}
            >
              <SelectTrigger className="h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Toggle
          id="includes-super"
          label="Salary includes superannuation"
          checked={inputs.includesSuper}
          onChange={(checked) => updateInput('includesSuper', checked)}
        />

        <NumberInput
          id="super-rate"
          label="Superannuation rate"
          value={inputs.superRate}
          onChange={(value) => updateInput('superRate', value)}
          suffix="%"
          min={0}
          max={50}
          step={0.25}
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium">Financial year</Label>
          <Select 
            value={inputs.year} 
            onValueChange={(value: FinancialYear) => updateInput('year', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">2025–2026</SelectItem>
              <SelectItem value="2024-25">2024–2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <RadioGroup
          id="residency"
          label="Resident for tax purposes?"
          value={inputs.residency}
          onChange={(value: Residency) => updateInput('residency', value)}
          options={[
            { value: 'resident', label: 'Yes' },
            { value: 'non-resident', label: 'No' }
          ]}
        />

        <Toggle
          id="tax-free-threshold"
          label="Claim the tax-free threshold?"
          checked={inputs.claimTaxFreeThreshold}
          onChange={(checked) => updateInput('claimTaxFreeThreshold', checked)}
          disabled={inputs.isSecondJob}
        />

        <Toggle
          id="second-job"
          label="Second job?"
          checked={inputs.isSecondJob}
          onChange={(checked) => {
            updateInput('isSecondJob', checked);
            if (checked) {
              updateInput('claimTaxFreeThreshold', false);
            }
          }}
        />

        <Toggle
          id="help-debt"
          label="HELP/HECS debt?"
          checked={inputs.hasHELP}
          onChange={(checked) => updateInput('hasHELP', checked)}
        />

        <Toggle
          id="private-health"
          label="Private health cover?"
          checked={inputs.hasPrivateHealth}
          onChange={(checked) => updateInput('hasPrivateHealth', checked)}
        />

        <RadioGroup
          id="medicare-exemption"
          label="Medicare Levy exemption/reduction"
          value={inputs.medicareReduction}
          onChange={(value: MLReduction) => updateInput('medicareReduction', value)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'half', label: 'Half' },
            { value: 'full', label: 'Full' }
          ]}
        />
      </CardContent>
    </Card>
  );
};