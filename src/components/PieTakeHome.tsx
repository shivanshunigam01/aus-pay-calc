import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatAUD } from "@/lib/money";

interface PieData {
  name: string;
  value: number;
  color: string;
}
interface PieTakeHomeProps {
  takeHome: number;
  incomeTax: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  helpRepayment: number;
}

export const PieTakeHome = ({
  takeHome,
  incomeTax,
  medicareLevy,
  medicareLevySurcharge,
  helpRepayment,
}: PieTakeHomeProps) => {
  const data: PieData[] = [
    { name: "Take-home pay", value: takeHome, color: "hsl(var(--primary))" },
    {
      name: "Income tax",
      value: incomeTax,
      color: "hsl(var(--muted-foreground))",
    },
    { name: "Medicare levy", value: medicareLevy, color: "hsl(var(--accent))" },
  ];

  if (medicareLevySurcharge > 0)
    data.push({
      name: "Medicare levy surcharge",
      value: medicareLevySurcharge,
      color: "hsl(220 9% 65%)",
    });
  if (helpRepayment > 0)
    data.push({
      name: "HELP/HECS",
      value: helpRepayment,
      color: "hsl(210 40% 85%)",
    });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{d.name}</p>
          <p className="text-sm text-muted-foreground">{formatAUD(d.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-56 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
