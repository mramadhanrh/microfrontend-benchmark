import { useState } from 'react';
import Dropdown from '../../atoms/dropdown';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface ChartData {
  labels: string[];
  income: number[];
  spending: number[];
}

interface IncomeSpendingChartProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const IncomeSpendingChart = ({
  selectedPeriod,
  onPeriodChange,
}: IncomeSpendingChartProps) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const chartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income: [3000, 5000, 4000, 5500, 6000, 5500],
    spending: [2000, 3500, 2800, 3800, 4200, 3900],
  };

  const maxValue = 8000;
  const periods = [
    { label: 'This week', value: 'This week' },
    { label: 'This month', value: 'This month' },
    { label: 'This quarter', value: 'This quarter' },
    { label: 'This year', value: 'This year' },
  ];

  const getBarHeight = (value: number) => {
    return (Math.abs(value) / maxValue) * 100;
  };

  return (
    <div className="bg-[#0F0F0F] rounded-xl p-6 md:p-8 border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-white text-xl font-semibold mb-1">
            Income vs Spending
          </h3>
          <p className="text-[#858585] text-sm">
            Financial overview for the period
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7dd87d] shadow-lg shadow-[#7dd87d]/50"></div>
              <span className="text-[#B3B3B3] text-sm font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1a4d4d] shadow-lg shadow-[#1a4d4d]/50"></div>
              <span className="text-[#B3B3B3] text-sm font-medium">
                Spending
              </span>
            </div>
          </div>
          {/* Period Filter */}
          <Dropdown
            label={selectedPeriod}
            icon={<FunnelIcon className="w-4 h-4" />}
            options={periods}
            onSelect={onPeriodChange}
          />
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[#858585] text-xs font-medium pr-4">
          <span>8k</span>
          <span>4k</span>
          <span className="text-[#B3B3B3]">0</span>
          <span>-4k</span>
          <span>-8k</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-px ${
                i === 2 ? 'bg-[#404040]' : 'bg-[#2D2D2D]'
              } transition-colors duration-300`}
            ></div>
          ))}
        </div>

        {/* Chart bars */}
        <div className="absolute left-12 right-0 top-0 bottom-0 flex items-center justify-around px-4">
          {chartData.labels.map((label, index) => {
            const incomeHeight = getBarHeight(chartData.income[index]);
            const spendingHeight = getBarHeight(chartData.spending[index]);
            const isHovered = hoveredBar === index;

            return (
              <div
                key={label}
                className="flex flex-col items-center flex-1 max-w-[80px] group"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Income bar (top) */}
                <div className="relative w-full flex justify-center items-end h-1/2">
                  <div
                    className="w-12 bg-gradient-to-t from-[#7dd87d] to-[#4CAF50] rounded-t-lg transition-all duration-500 ease-out shadow-lg hover:shadow-[#7dd87d]/50 cursor-pointer relative group/bar"
                    style={{ height: `${incomeHeight}%` }}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[#404040] rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200 z-10">
                        <p className="text-[#7dd87d] text-xs font-semibold">
                          ${chartData.income[index].toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spending bar (bottom) */}
                <div className="relative w-full flex justify-center items-start h-1/2">
                  <div
                    className="w-12 bg-gradient-to-b from-[#1a4d4d] to-[#0d2626] rounded-b-lg transition-all duration-500 ease-out shadow-lg hover:shadow-[#1a4d4d]/50 cursor-pointer relative group/bar"
                    style={{ height: `${spendingHeight}%` }}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[#404040] rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200 z-10">
                        <p className="text-[#1a4d4d] text-xs font-semibold">
                          ${chartData.spending[index].toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* X-axis label */}
                <span
                  className={`text-xs font-medium mt-3 transition-all duration-300 ${
                    isHovered ? 'text-white scale-110' : 'text-[#858585]'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IncomeSpendingChart;
