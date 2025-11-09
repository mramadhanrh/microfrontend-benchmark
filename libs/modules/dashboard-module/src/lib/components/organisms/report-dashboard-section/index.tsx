import { useState } from 'react';
import BalanceCard from '../../molecules/balance-card';
import IncomeSpendingChart from '../../molecules/income-spending-chart';
import TransactionHistory from '../../molecules/transaction-history';
import AvailableBalanceCard from '../../molecules/available-balance-card';
import SavingsCard from '../../molecules/savings-card';

const ReportDashboardSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This month');

  return (
    <div className="w-full">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content (Desktop: 2 cols, Mobile: Full width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <BalanceCard />

          {/* Income vs Spending Chart */}
          <IncomeSpendingChart
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Transaction History Table */}
          <TransactionHistory />
        </div>

        {/* Right Column - Summary Cards (Desktop: 1 col, Mobile: Full width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Available Balance Donut Chart */}
          <AvailableBalanceCard />

          {/* Savings Breakdown */}
          <SavingsCard />
        </div>
      </div>
    </div>
  );
};

export default ReportDashboardSection;
