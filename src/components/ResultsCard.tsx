import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FrequencyTabs } from "./FrequencyTabs";
import { PieTakeHome } from "./PieTakeHome";
import { formatAUD, fromAnnual, Frequency } from "@/lib/money";
import { TaxCalculation } from "@/lib/ausTax";

interface ResultsCardProps {
  calculation: TaxCalculation;
  displayFrequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
}

export const ResultsCard = ({
  calculation,
  displayFrequency,
  onFrequencyChange
}: ResultsCardProps) => {
  const {
    baseIncome,
    employerSuper,
    incomeTax,
    medicareLevy,
    medicareLevySurcharge,
    helpRepayment,
    totalDeductions,
    takeHomeAnnual
  } = calculation;

  const convertToDisplayFreq = (annual: number) => fromAnnual(annual, displayFrequency);

  const frequencyLabel = displayFrequency === 'weekly' ? 'week' : 
                        displayFrequency === 'monthly' ? 'month' : 'year';

  return (
    <Card className="h-fit shadow-sm bg-white">
      <CardHeader className="pb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Your take home pay is
          </h2>
          <div className="relative mb-6">
            <div className="text-5xl font-bold text-primary mb-2">
              {formatAUD(convertToDisplayFreq(takeHomeAnnual))}
            </div>
            <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              NET
            </div>
          </div>
          <FrequencyTabs value={displayFrequency} onChange={onFrequencyChange} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <PieTakeHome
          takeHome={convertToDisplayFreq(takeHomeAnnual)}
          incomeTax={convertToDisplayFreq(incomeTax)}
          medicareLevy={convertToDisplayFreq(medicareLevy)}
          medicareLevySurcharge={convertToDisplayFreq(medicareLevySurcharge)}
          helpRepayment={convertToDisplayFreq(helpRepayment)}
        />

        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Breakdown</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross (base)</span>
              <span className="font-medium">{formatAUD(convertToDisplayFreq(baseIncome))}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Income tax</span>
              <span className="font-medium">-{formatAUD(convertToDisplayFreq(incomeTax))}</span>
            </div>
            
            {medicareLevy > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medicare levy</span>
                <span className="font-medium">-{formatAUD(convertToDisplayFreq(medicareLevy))}</span>
              </div>
            )}
            
            {medicareLevySurcharge > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medicare levy surcharge</span>
                <span className="font-medium">-{formatAUD(convertToDisplayFreq(medicareLevySurcharge))}</span>
              </div>
            )}
            
            {helpRepayment > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">HELP/HECS</span>
                <span className="font-medium">-{formatAUD(convertToDisplayFreq(helpRepayment))}</span>
              </div>
            )}
            
            <div className="border-t pt-2 flex justify-between font-medium">
              <span className="text-muted-foreground">Total tax & deductions</span>
              <span>-{formatAUD(convertToDisplayFreq(totalDeductions))}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Take-home pay</span>
              <span>{formatAUD(convertToDisplayFreq(takeHomeAnnual))}</span>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employer super</span>
                <span className="font-medium text-accent">{formatAUD(convertToDisplayFreq(employerSuper))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-3">
          Figures use Australian ATO rates for the selected year. Medicare components 
          and HELP apply when selected.
        </div>
      </CardContent>
    </Card>
  );
};