import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "./NumberInput";
import { RadioGroup } from "./RadioGroup";
import { CalculationInputs, FinancialYear, Residency, MLReduction } from "@/lib/ausTax";
import { Frequency } from "@/lib/money";
import { HelpCircle } from "lucide-react";

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
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Pay Calculator</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="text-primary border-primary hover:bg-primary/5"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Your salary */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Your salary</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <NumberInput
                id="salary"
                label=""
                value={inputs.salary}
                onChange={(value) => updateInput('salary', value)}
                prefix="$"
                placeholder="60,000"
                className="h-10"
              />
            </div>
            <div className="w-32">
              <Select 
                value={inputs.frequency} 
                onValueChange={(value: Frequency) => updateInput('frequency', value)}
              >
                <SelectTrigger className="h-10">
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
        </div>

        {/* Salary includes superannuation */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includes-super"
            checked={inputs.includesSuper}
            onCheckedChange={(checked) => updateInput('includesSuper', !!checked)}
          />
          <Label htmlFor="includes-super" className="text-sm text-red-600 cursor-pointer">
            Salary includes superannuation
          </Label>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>

        {/* Superannuation rate */}
        <div className="flex gap-6">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Superannuation rate</Label>
            <NumberInput
              id="super-rate"
              label=""
              value={inputs.superRate}
              onChange={(value) => updateInput('superRate', value)}
              suffix="%"
              min={0}
              max={50}
              step={0.25}
              className="h-10"
            />
          </div>
          
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Tax year</Label>
            <Select 
              value={inputs.year} 
              onValueChange={(value: FinancialYear) => updateInput('year', value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-26">2025-2026</SelectItem>
                <SelectItem value="2024-25">2024-2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Australian resident */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Are you an Australian resident for tax purposes?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="residency"
            label=""
            value={inputs.residency}
            onChange={(value: Residency) => updateInput('residency', value)}
            options={[
              { value: 'resident', label: 'Yes' },
              { value: 'non-resident', label: 'No' }
            ]}
          />
        </div>

        {/* Student loan debt */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Do you have student loan debt?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="student-loan"
            label=""
            value={inputs.hasStudentLoanDebt ? 'yes' : 'no'}
            onChange={(value: string) => updateInput('hasStudentLoanDebt', value === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        {/* Tax-free threshold */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Are you claiming the tax-free threshold?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="tax-free-threshold"
            label=""
            value={inputs.claimTaxFreeThreshold ? 'yes' : 'no'}
            onChange={(value: string) => {
              updateInput('claimTaxFreeThreshold', value === 'yes');
            }}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        {/* Student loan debt (HELP) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Do you have student loan debt?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="help-debt"
            label=""
            value={inputs.hasHELP ? 'yes' : 'no'}
            onChange={(value: string) => updateInput('hasHELP', value === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        {/* Working holiday visa */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Are you on a working holiday visa?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="working-holiday"
            label=""
            value={inputs.onWorkingHolidayVisa ? 'yes' : 'no'}
            onChange={(value: string) => updateInput('onWorkingHolidayVisa', value === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        {/* Private hospital cover */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Do you have private hospital cover?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="private-health"
            label=""
            value={inputs.hasPrivateHealth ? 'yes' : 'no'}
            onChange={(value: string) => updateInput('hasPrivateHealth', value === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>

        {/* Family status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Family status</Label>
          <div className="flex">
            <Button
              type="button"
              variant={inputs.familyStatus === 'single' ? 'default' : 'outline'}
              className={`flex-1 rounded-r-none ${
                inputs.familyStatus === 'single' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => updateInput('familyStatus', 'single')}
            >
              Single
            </Button>
            <Button
              type="button"
              variant={inputs.familyStatus === 'family' ? 'default' : 'outline'}
              className={`flex-1 rounded-l-none border-l-0 ${
                inputs.familyStatus === 'family' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => updateInput('familyStatus', 'family')}
            >
              Family
            </Button>
          </div>
        </div>

        {/* Number of dependants */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Number of dependants</Label>
          <Select 
            value={inputs.numberOfDependants.toString()} 
            onValueChange={(value: string) => updateInput('numberOfDependants', parseInt(value))}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 11 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SAPTO eligibility */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">Are you eligible for SAPTO?</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          <RadioGroup
            id="sapto"
            label=""
            value={inputs.eligibleForSAPTO ? 'yes' : 'no'}
            onChange={(value: string) => updateInput('eligibleForSAPTO', value === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};