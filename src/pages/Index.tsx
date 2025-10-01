import { useState, useEffect, useMemo } from "react";
import { PayCalculatorForm } from "@/components/PayCalculatorForm";
import { ResultsCard } from "@/components/ResultsCard";
import { calculateTax, CalculationInputs } from "@/lib/ausTax";
import { Frequency } from "@/lib/money";
import { ModeToggle } from "@/components/ModeToggle";

const DEFAULT_INPUTS: CalculationInputs = {
  salary: 60000,
  frequency: "annually",
  includesSuper: false,
  superRate: 12,
  year: "2025-26",
  residency: "resident",
  claimTaxFreeThreshold: true,
  hasHELP: false,
  hasPrivateHealth: false,
  isSecondJob: false,
  medicareReduction: "none",
  hasStudentLoanDebt: false,
  onWorkingHolidayVisa: false,
  familyStatus: "single",
  numberOfDependants: 0,
  eligibleForSAPTO: false,
};

const STORAGE_KEY = "payCalculatorInputs";

const Index = () => {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [displayFrequency, setDisplayFrequency] =
    useState<Frequency>("annually");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedInputs = JSON.parse(saved);
        setInputs({ ...DEFAULT_INPUTS, ...parsedInputs });
      } catch {
        console.warn("Failed to parse saved inputs");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const calculation = useMemo(() => calculateTax(inputs), [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setDisplayFrequency("annually");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Quick Income Tax Calculator
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Fast &amp; free in-hand salary calculator for Australia
              </p>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 max-w-[1200px]">
          {/* Form FIRST on mobile and desktop */}
          <div className="order-1 lg:order-1">
            <PayCalculatorForm
              inputs={inputs}
              onChange={setInputs}
              onReset={handleReset}
            />
          </div>

          {/* Results SECOND on mobile and desktop */}
          <div className="order-2 lg:order-2">
            <ResultsCard
              calculation={calculation}
              displayFrequency={displayFrequency}
              onFrequencyChange={setDisplayFrequency}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>
            © Nanak Accountants & Associates. Tax rates sourced from the
            Australian Tax Office.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
