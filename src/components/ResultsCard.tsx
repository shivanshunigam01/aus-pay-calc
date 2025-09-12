import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrequencyTabs } from "./FrequencyTabs";
import { PieTakeHome } from "./PieTakeHome";
import { formatAUD, fromAnnual, Frequency } from "@/lib/money";
import { TaxCalculation } from "@/lib/ausTax";
import { Info } from "lucide-react";

interface ResultsCardProps {
  calculation: TaxCalculation;
  displayFrequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const pct = (part: number, whole: number) =>
  whole > 0 ? ((part / whole) * 100).toFixed(1) : "0.0";

const DISCOVERY_URL =
  "https://calendly.com/nanakaccountant/discovery-meeting?back=1&month=2025-09";

export const ResultsCard = ({
  calculation,
  displayFrequency,
  onFrequencyChange,
}: ResultsCardProps) => {
  const {
    baseIncome,
    employerSuper,
    incomeTax,
    medicareLevy,
    medicareLevySurcharge,
    helpRepayment,
    takeHomeAnnual,
    marginalRate,
  } = calculation;

  // convert to the chosen period
  const b = fromAnnual(baseIncome, displayFrequency);
  const sup = fromAnnual(employerSuper, displayFrequency);
  const itx = fromAnnual(incomeTax, displayFrequency);
  const ml = fromAnnual(medicareLevy, displayFrequency);
  const mls = fromAnnual(medicareLevySurcharge, displayFrequency);
  const help = fromAnnual(helpRepayment, displayFrequency);
  const take = fromAnnual(takeHomeAnnual, displayFrequency);

  // rounding reconciliation
  const totalTax = itx + ml + mls + help;
  const drift = round2(b - totalTax - take);
  const offsets = Math.abs(drift) < 0.005 ? 0 : drift;

  // dynamic % badges
  const takePct = pct(take, b);
  const supPct = pct(sup, b);
  const itxPct = pct(itx, b);
  const mlPct = pct(ml, b);
  const mlsPct = pct(mls, b);
  const helpPct = pct(help, b);

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <div className="text-center">
            <PieTakeHome
              takeHome={take}
              incomeTax={itx}
              medicareLevy={ml}
              medicareLevySurcharge={mls}
              helpRepayment={help}
            />
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">
                Your take home pay is{" "}
                <span className="bg-primary text-white px-2 py-0.5 rounded-md text-xs font-semibold">
                  {takePct}%
                </span>
              </p>
              <div className="text-4xl font-extrabold text-primary mb-4">
                {formatAUD(round2(take))}
              </div>

              <FrequencyTabs
                value={displayFrequency}
                onChange={onFrequencyChange}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-4">
          <BreakdownRow
            label="Superannuation"
            color="bg-teal-400"
            badge={supPct}
            amount={sup}
          />
          <BreakdownRow
            label="Income Tax"
            color="bg-blue-400"
            badge={itxPct}
            amount={itx}
          />
          <BreakdownRow
            label="Medicare Levy"
            color="bg-purple-400"
            badge={mlPct}
            amount={ml}
          />
          <BreakdownRow
            label="Medicare Levy Surcharge"
            color="bg-green-400"
            badge={mlsPct}
            amount={mls}
          />
          <BreakdownRow
            label="HELP / SSL / TLS Repayment"
            color="bg-yellow-400"
            badge={helpPct}
            amount={help}
          />
          <BreakdownRow
            label="SAPTO"
            color="bg-emerald-500"
            badge={"0.0"}
            amount={0}
          />
          <BreakdownRow
            label="Tax Offsets"
            color="bg-gray-400"
            badge={offsets === 0 ? "0.0" : pct(offsets, b)}
            amount={offsets}
            negativeStyle
          />

          <div className="border-t pt-3 space-y-2">
            <SummaryRow label="Total Tax" value={formatAUD(round2(totalTax))} />
            <SummaryRow
              label="Total Taxable Income"
              value={formatAUD(round2(b))}
            />
            <SummaryRow
              label="Marginal Tax Rate"
              value={`${Math.round((marginalRate || 0) * 100)}%`}
            />
          </div>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="bg-[#0A2A66] rounded-2xl shadow-md">
        <CardContent className="p-6 text-center">
          <Button
            asChild
            className="bg-black hover:bg-black/90 text-white font-semibold text-base px-8 py-3 rounded-full shadow-md"
          >
            <a href={DISCOVERY_URL} target="_blank" rel="noopener noreferrer">
              Book Your Free 15 Minute Consultation
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const BreakdownRow = ({
  label,
  color,
  badge,
  amount,
  negativeStyle = false,
}: {
  label: string;
  color: string;
  badge: string;
  amount: number;
  negativeStyle?: boolean;
}) => {
  const badgeClass =
    "px-2 py-0.5 text-xs font-semibold rounded-full " +
    (negativeStyle && amount < 0
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-700");

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 ${color} rounded-full`} />
        <span className="text-gray-700">{label}</span>
        <Info className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="text-right">
        <div className={badgeClass}>{badge}%</div>
        <div className="font-medium">{formatAUD(round2(amount))}</div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm font-semibold">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
