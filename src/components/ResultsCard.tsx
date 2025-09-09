import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrequencyTabs } from "./FrequencyTabs";
import { PieTakeHome } from "./PieTakeHome";
import { formatAUD, fromAnnual, Frequency } from "@/lib/money";
import { TaxCalculation } from "@/lib/ausTax";
import { ArrowRight } from "lucide-react";

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
  
  const takeHomePercentage = ((takeHomeAnnual / baseIncome) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="text-center">
            <PieTakeHome
              takeHome={convertToDisplayFreq(takeHomeAnnual)}
              incomeTax={convertToDisplayFreq(incomeTax)}
              medicareLevy={convertToDisplayFreq(medicareLevy)}
              medicareLevySurcharge={convertToDisplayFreq(medicareLevySurcharge)}
              helpRepayment={convertToDisplayFreq(helpRepayment)}
            />
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">
                Your take home pay is <span className="bg-primary text-white px-2 py-0.5 rounded text-xs font-medium">{takeHomePercentage}%</span>
              </p>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {formatAUD(convertToDisplayFreq(takeHomeAnnual))}
              </div>
              <FrequencyTabs value={displayFrequency} onChange={onFrequencyChange} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Breakdown items with colored dots and percentages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                <span className="text-gray-600">Superannuation</span>
              </div>
              <div className="text-right">
                <div className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                  12.0%
                </div>
                <div className="font-medium">{formatAUD(convertToDisplayFreq(employerSuper))}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600">Income Tax</span>
              </div>
              <div className="text-right">
                <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                  {((incomeTax / baseIncome) * 100).toFixed(1)}%
                </div>
                <div className="font-medium">{formatAUD(convertToDisplayFreq(incomeTax))}</div>
              </div>
            </div>

            {medicareLevy > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-600">Medicare Levy</span>
                </div>
                <div className="text-right">
                  <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                    2.0%
                  </div>
                  <div className="font-medium">{formatAUD(convertToDisplayFreq(medicareLevy))}</div>
                </div>
              </div>
            )}

            {medicareLevySurcharge > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600">Medicare Levy Surcharge</span>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                    0.0%
                  </div>
                  <div className="font-medium">{formatAUD(convertToDisplayFreq(medicareLevySurcharge))}</div>
                </div>
              </div>
            )}

            {helpRepayment > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-600">HELP / SSL / TLS Repayment</span>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                    0.5%
                  </div>
                  <div className="font-medium">{formatAUD(convertToDisplayFreq(helpRepayment))}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">SAPTO</span>
              </div>
              <div className="text-right">
                <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                  0.0%
                </div>
                <div className="font-medium">$0.00</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Tax Offsets</span>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium inline-block mb-1">
                  -$2%
                </div>
                <div className="font-medium">-$100.00</div>
              </div>
            </div>
          </div>

          {/* Summary totals */}
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Tax</span>
              <span>{formatAUD(convertToDisplayFreq(incomeTax))}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total Taxable Income</span>
              <span>{formatAUD(convertToDisplayFreq(baseIncome))}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Marginal Tax Rate</span>
              <span>30%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Insurance Banner */}
      <Card className="bg-primary text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="w-6 h-6 bg-white/40 rounded"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Don't pay the lazy tax. Find a better deal on health insurance.</h3>
              <p className="text-sm text-white/90 mb-3">Compare yours in just 2 minutes.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter your Postcode"
                  className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/70 text-sm flex-1"
                />
                <Button className="bg-white text-primary hover:bg-white/90 px-6">
                  Compare
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};