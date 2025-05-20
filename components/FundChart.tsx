"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Sector, LabelList, Label } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const chartData = [
  { title: "used", amount: 10000, fill: "var(--color-used)" },
  { title: "unused", amount: 90000, fill: "var(--color-unused)" },
];

const chartConfig = {
  amount: { label: "Amount" },
  used: { label: "Used", color: "hsl(var(--secondary))" },
  unused: { label: "Unused", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
    }).format(value)
}

const renderLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  value: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 50;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="text-sm font-extrabold"
      fill="hsl(var(--primary))"
    >
        {
            formatCurrency(value)
        }
    </text>
  );
};

export default function FundChart() {
  return (
    <div className="w-full flex flex-col items-center">
      <ChartContainer
      config={chartConfig}
      className="mx-auto min-h-[200px] w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="amount" hideLabel />}
        />
        <Pie
          data={chartData}
          nameKey="title"
          dataKey="amount"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
          label={renderLabel}
          labelLine={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                    >
                      {formatCurrency(chartData[0].amount + chartData[1].amount)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Value
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
    <span>
      <strong>
        {(chartData[0].amount / (chartData[0].amount + chartData[1].amount) * 100).toFixed(1)}%
      </strong> of fund allocated
    </span>
    </div>
  );
}
