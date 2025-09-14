import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrequencyTabs } from "./FrequencyTabs";
import { PieTakeHome } from "./PieTakeHome";
import { formatAUD, fromAnnual, Frequency } from "@/lib/money";
import { TaxCalculation } from "@/lib/ausTax";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

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

  const b = fromAnnual(baseIncome, displayFrequency);
  const sup = fromAnnual(employerSuper, displayFrequency);
  const itx = fromAnnual(incomeTax, displayFrequency);
  const ml = fromAnnual(medicareLevy, displayFrequency);
  const mls = fromAnnual(medicareLevySurcharge, displayFrequency);
  const help = fromAnnual(helpRepayment, displayFrequency);
  const take = fromAnnual(takeHomeAnnual, displayFrequency);

  const totalTax = itx + ml + mls + help;
  const drift = round2(b - totalTax - take);
  const offsets = Math.abs(drift) < 0.005 ? 0 : drift;

  const takePct = pct(take, b);
  const supPct = pct(sup, b);
  const itxPct = pct(itx, b);
  const mlPct = pct(ml, b);
  const mlsPct = pct(mls, b);
  const helpPct = pct(help, b);

  return (
    <div className="space-y-4">
      <Card className="bg-card shadow-sm rounded-2xl">
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
              <p className="text-sm text-muted-foreground mb-1">
                Your take home pay is{" "}
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs font-semibold align-middle">
                  {takePct}%
                </span>
              </p>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
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
            tooltip="This is the amount your employer pays into your superannuation account. It's your money (for when you retire) and is generally taxed at a lower rate than your other income."
          />
          <BreakdownRow
            label="Income Tax"
            color="bg-blue-400"
            badge={itxPct}
            amount={itx}
            showInfo={false}
          />
          <BreakdownRow
            label="Medicare Levy"
            color="bg-purple-400"
            badge={mlPct}
            amount={ml}
            tooltip="Medicare gives Australian residents access to health care. It's partly funded by the Medicare levy, which is 2% of your taxable income for most taxpayers. You pay a Medicare levy in addition to the income tax you pay on your taxable income."
          />
          <BreakdownRow
            label="Medicare Levy Surcharge"
            color="bg-green-400"
            badge={mlsPct}
            amount={mls}
            tooltip="The Medicare levy surcharge (MLS) is levied on Australian taxpayers who don't have an appropriate level of private hospital insurance and who earn above a certain income threshold."
          />
          <BreakdownRow
            label="HELP / SSL / TLS Repayment"
            color="bg-yellow-400"
            badge={helpPct}
            amount={help}
            showInfo={false}
          />
          <BreakdownRow
            label="SAPTO"
            color="bg-emerald-500"
            badge={"0.0"}
            amount={0}
            showInfo={false}
          />
          <BreakdownRow
            label="Tax Offsets"
            color="bg-gray-400"
            badge={offsets === 0 ? "0.0" : pct(offsets, b)}
            amount={offsets}
            negativeStyle
            tooltip="Depending on your income, you may be entitled to income tax offsets."
          />

          <div className="border-t border-border pt-3 space-y-2">
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

      {/* CTA Card — responsive button */}
      <Card className="rounded-2xl shadow-md overflow-hidden bg-[#0A2A66] dark:bg-[#0B1E46]">
        <CardContent className="p-4 sm:p-6 text-center">
          <Button
            asChild
            className="
          w-full h-auto min-h-[44px]
          inline-flex items-center justify-center
          px-4 sm:px-6 md:px-8 py-3 sm:py-4
          text-white font-semibold
          text-base sm:text-lg md:text-xl leading-snug
          whitespace-normal break-words text-pretty
          rounded-lg sm:rounded-xl md:rounded-full
          bg-transparent hover:bg-white/10 shadow-none
        "
            aria-label="Book Your Free 15 Minute Consultation"
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
  tooltip,
  showInfo = true,
}: {
  label: string;
  color: string;
  badge: string;
  amount: number;
  negativeStyle?: boolean;
  tooltip?: string;
  showInfo?: boolean;
}) => {
  const badgeClass =
    "px-2 py-0.5 text-xs font-semibold rounded-full " +
    (negativeStyle && amount < 0
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
      : "bg-secondary text-foreground/80");

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-3 h-3 ${color} rounded-full`} />
        <span className="text-foreground truncate">{label}</span>

        {showInfo ? (
          tooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1 -m-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Info about ${label}`}
                  >
                    <Info className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="rounded-xl bg-card text-foreground border border-border shadow-lg max-w-xs"
                >
                  <p className="text-sm leading-snug">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          )
        ) : (
          /* keep layout alignment without showing an icon */
          <span aria-hidden className="w-3.5 h-3.5 invisible" />
        )}
      </div>

      <div className="text-right">
        <div className={badgeClass}>{badge}%</div>
        <div className="font-medium text-foreground">
          {formatAUD(round2(amount))}
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm font-semibold text-foreground">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);
