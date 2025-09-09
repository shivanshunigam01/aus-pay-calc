import { useState, useEffect, useMemo } from "react";
import { PayCalculatorForm } from "@/components/PayCalculatorForm";
import { ResultsCard } from "@/components/ResultsCard";
import { calculateTax, CalculationInputs } from "@/lib/ausTax";
import { Frequency } from "@/lib/money";

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

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedInputs = JSON.parse(saved);
        setInputs({ ...DEFAULT_INPUTS, ...parsedInputs });
      } catch (e) {
        console.warn("Failed to parse saved inputs");
      }
    }
  }, []);

  // Save to localStorage when inputs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  // Calculate results with debouncing
  const calculation = useMemo(() => {
    return calculateTax(inputs);
  }, [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setDisplayFrequency("annually");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          {/* <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-primary font-semibold">money.com.au</span>
          </div> */}
          <h1 className="text-4xl font-bold text-foreground mb-2">
            PAY CALCULATOR
          </h1>
          <p className="text-muted-foreground text-lg">
            Find out how much take-home pay you'll receive if you're earning a
            certain salary
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[420px_1fr] gap-8 max-w-[1200px]">
          {/* Form */}
          <div>
            <PayCalculatorForm
              inputs={inputs}
              onChange={setInputs}
              onReset={handleReset}
            />
          </div>

          {/* Results */}
          <div>
            <ResultsCard
              calculation={calculation}
              displayFrequency={displayFrequency}
              onFrequencyChange={setDisplayFrequency}
            />
          </div>
        </div>

        {/* Information Sections */}
        <div className="mt-16 max-w-4xl mx-auto space-y-12">
          <section className="prose prose-neutral max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              How to calculate your take-home pay (Australia)
            </h2>
            <p className="text-muted-foreground">
              Your take-home pay is calculated by deducting income tax, Medicare
              levy, Medicare levy surcharge (if applicable), and HELP/HECS
              repayments from your gross salary. This calculator uses the latest
              Australian Tax Office (ATO) rates and thresholds.
            </p>
          </section>

          <section className="prose prose-neutral max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Income tax brackets (2025–26)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Residents</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span>$0 – $18,200</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>$18,201 – $45,000</span>
                    <span>16%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>$45,001 – $135,000</span>
                    <span>30%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>$135,001 – $190,000</span>
                    <span>37%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>$190,001+</span>
                    <span>45%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Non-residents</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span>$0 – $135,000</span>
                    <span>30%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>$135,001 – $190,000</span>
                    <span>37%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>$190,001+</span>
                    <span>45%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="prose prose-neutral max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Is our Pay Calculator accurate?
            </h2>
            <p className="text-muted-foreground">
              This calculator uses official Australian Tax Office rates and is
              updated for the 2025–26 financial year. Results are estimates and
              may vary based on individual circumstances. For complex
              situations, consult a qualified tax professional.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>
            © 2024 Australian Pay Calculator. Tax rates sourced from the
            Australian Tax Office.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
