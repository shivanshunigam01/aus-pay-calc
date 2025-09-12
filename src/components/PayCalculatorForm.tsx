import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "./NumberInput";
import { RadioGroup } from "./RadioGroup";
import { CalculationInputs, FinancialYear, Residency } from "@/lib/ausTax";
import { Frequency } from "@/lib/money";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { TooltipArrow } from "@radix-ui/react-tooltip";

interface PayCalculatorFormProps {
  inputs: CalculationInputs;
  onChange: (inputs: CalculationInputs) => void;
  onReset: () => void;
}

export const PayCalculatorForm = ({
  inputs,
  onChange,
  onReset,
}: PayCalculatorFormProps) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateInput = <K extends keyof CalculationInputs>(
    key: K,
    value: CalculationInputs[K]
  ) => onChange({ ...inputs, [key]: value });

  return (
    <Card className="w-full bg-white shadow-sm rounded-2xl">
      <CardHeader className="pb-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Pay Calculator
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-primary border-primary hover:bg-primary/5"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              aria-controls="advanced-section"
              className="gap-1"
            >
              {showAdvanced ? (
                <>
                  Hide Advanced <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show Advanced <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Salary + Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="salary"
              className="text-sm font-medium text-gray-700"
            >
              Your salary
            </Label>
            <NumberInput
              id="salary"
              label=""
              value={inputs.salary}
              onChange={(value) => updateInput("salary", value)}
              prefix="$"
              placeholder="60,000"
              className="h-10 w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="frequency"
              className="text-sm font-medium text-gray-700"
            >
              Frequency
            </Label>
            <Select
              value={inputs.frequency}
              onValueChange={(v: Frequency) => updateInput("frequency", v)}
            >
              <SelectTrigger id="frequency" className="h-10 w-full">
                <SelectValue placeholder="Annually" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Includes super */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="includes-super"
            checked={inputs.includesSuper}
            onCheckedChange={(checked) =>
              updateInput("includesSuper", !!checked)
            }
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                  <Label
                    htmlFor="includes-super"
                    className="text-sm cursor-pointer m-0"
                  >
                    Salary includes superannuation
                  </Label>
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-xs"
              >
                <p className="text-sm">
                  Only tick this box if you have included your super in your
                  salary figure.
                </p>
                <TooltipArrow className="fill-white" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Super + Year */}
        <div className="flex gap-6">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Superannuation rate
            </Label>
            <NumberInput
              id="super-rate"
              label=""
              value={inputs.superRate}
              onChange={(value) => updateInput("superRate", value)}
              suffix="%"
              min={0}
              max={50}
              step={0.25}
              className="h-10"
            />
          </div>

          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Tax year
            </Label>
            <Select
              value={inputs.year}
              onValueChange={(v: FinancialYear) => updateInput("year", v)}
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

        {/* Residency — single help icon for the whole question */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                    <Label className="text-sm font-medium text-gray-700 m-0">
                      Are you an Australian resident for tax purposes?
                    </Label>
                    {/* ONE help icon only */}
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-md"
                >
                  <p className="text-sm">
                    Foreign residents pay different rates and don’t pay the
                    Medicare Levy or receive certain offsets. See ATO guidance
                    for definitions and details.
                  </p>
                  <TooltipArrow className="fill-white" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <RadioGroup
            id="residency"
            label=""
            value={inputs.residency}
            onChange={(v: Residency) => updateInput("residency", v)}
            options={[
              { value: "resident", label: "Yes" },
              { value: "non-resident", label: "No" },
            ]}
          />
        </div>

        {/* ADVANCED SECTION (collapsible) */}
        <div
          id="advanced-section"
          className={showAdvanced ? "space-y-6" : "hidden"}
        >
          {/* Student loan debt (generic informational) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                      <Label className="text-sm font-medium text-gray-700 m-0">
                        Do you have student loan debt?
                      </Label>
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-md"
                  >
                    <p className="text-sm">
                      For general student loans; use this for informational
                      capture only.
                    </p>
                    <TooltipArrow className="fill-white" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <RadioGroup
              id="student-loan-generic"
              label=""
              value={inputs.hasStudentLoanDebt ? "yes" : "no"}
              onChange={(v: string) =>
                updateInput("hasStudentLoanDebt", v === "yes")
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          {/* Tax-free threshold */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                      <Label className="text-sm font-medium text-gray-700 m-0">
                        Are you claiming the tax-free threshold?
                      </Label>
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-md"
                  >
                    <p className="text-sm">
                      Generally claim from only one payer—the one who pays the
                      highest wage.
                    </p>
                    <TooltipArrow className="fill-white" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <RadioGroup
              id="tft"
              label=""
              value={inputs.claimTaxFreeThreshold ? "yes" : "no"}
              onChange={(v: string) =>
                updateInput("claimTaxFreeThreshold", v === "yes")
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          {/* HELP / HECS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                      <Label className="text-sm font-medium text-gray-700 m-0">
                        Do you have student loan debt?
                      </Label>
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-md"
                  >
                    <p className="text-sm">
                      HELP/HECS, VSL, SFSS, SSL, ABSTUDY SSL, AASL (TSL).
                      Affects withholding.
                    </p>
                    <TooltipArrow className="fill-white" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <RadioGroup
              id="help-debt"
              label=""
              value={inputs.hasHELP ? "yes" : "no"}
              onChange={(v: string) => updateInput("hasHELP", v === "yes")}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          {/* Working holiday visa */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                      <Label className="text-sm font-medium text-gray-700 m-0">
                        Are you on a working holiday visa?
                      </Label>
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-md"
                  >
                    <p className="text-sm">
                      Subclass 417 or 462 visa (Working Holiday Maker).
                    </p>
                    <TooltipArrow className="fill-white" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <RadioGroup
              id="whv"
              label=""
              value={inputs.onWorkingHolidayVisa ? "yes" : "no"}
              onChange={(v: string) =>
                updateInput("onWorkingHolidayVisa", v === "yes")
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          {/* Private hospital cover */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 text-gray-900 cursor-default px-2 py-0.5">
                      <Label className="text-sm font-medium text-gray-700 m-0">
                        Do you have private hospital cover?
                      </Label>
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="rounded-xl bg-white text-gray-800 border shadow-lg max-w-md"
                  >
                    <p className="text-sm">
                      Singles: excess ≤ $750; couples/families: excess ≤ $1,500.
                    </p>
                    <TooltipArrow className="fill-white" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <RadioGroup
              id="private-health"
              label=""
              value={inputs.hasPrivateHealth ? "yes" : "no"}
              onChange={(v: string) =>
                updateInput("hasPrivateHealth", v === "yes")
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>

          {/* Family status (with spouse income if family) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Family status
            </Label>

            <div className="flex overflow-hidden rounded-full border border-primary">
              <Button
                type="button"
                variant="ghost"
                className={`flex-1 rounded-none py-3 text-sm font-medium transition-colors ${
                  inputs.familyStatus === "single"
                    ? "bg-primary text-white"
                    : "bg-transparent text-gray-900 hover:bg-primary/10"
                }`}
                onClick={() => updateInput("familyStatus", "single")}
              >
                Single
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`flex-1 rounded-none py-3 text-sm font-medium transition-colors ${
                  inputs.familyStatus === "family"
                    ? "bg-primary text-white"
                    : "bg-transparent text-gray-900 hover:bg-primary/10"
                }`}
                onClick={() => updateInput("familyStatus", "family")}
              >
                Family
              </Button>
            </div>

            {inputs.familyStatus === "family" && (
              <div className="space-y-2 pt-3">
                <Label
                  htmlFor="spouse-income"
                  className="text-sm font-medium text-gray-700"
                >
                  Spouse income (per annum)
                </Label>
                <NumberInput
                  id="spouse-income"
                  label=""
                  value={inputs.spouseIncome ?? 0}
                  onChange={(v) => updateInput("spouseIncome", v)}
                  prefix="$"
                  placeholder="60,000"
                  className="h-10 w-full"
                />
              </div>
            )}
          </div>

          {/* Number of dependants */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Number of dependants
            </Label>
            <Select
              value={String(inputs.numberOfDependants)}
              onValueChange={(v: string) =>
                updateInput("numberOfDependants", parseInt(v))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SAPTO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Are you eligible for SAPTO?
              </Label>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            <RadioGroup
              id="sapto"
              label=""
              value={inputs.eligibleForSAPTO ? "yes" : "no"}
              onChange={(v: string) =>
                updateInput("eligibleForSAPTO", v === "yes")
              }
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
