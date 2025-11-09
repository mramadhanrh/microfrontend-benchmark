import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Avatar from '../../atoms/avatar';

interface Transaction {
  name: string;
  deposits: string;
  withdrawals: string;
  investments: string;
  expenses: string;
}

type TabType =
  | 'investments'
  | 'deposits'
  | 'withdrawals'
  | 'investments-detail'
  | 'expenses';

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState<TabType>('investments-detail');

  const tabs = [
    { id: 'investments' as TabType, label: 'Investments' },
    { id: 'deposits' as TabType, label: 'Deposits' },
    { id: 'withdrawals' as TabType, label: 'Withdrawals' },
    { id: 'investments-detail' as TabType, label: 'Investments' },
    { id: 'expenses' as TabType, label: 'Expenses' },
  ];

  const transactions: Transaction[] = [
    {
      name: 'John Wick',
      deposits: '$95.85',
      withdrawals: '$105.50',
      investments: '$185.55',
      expenses: '$88.55',
    },
    {
      name: 'Nick Deep',
      deposits: '$90.85',
      withdrawals: '$115.50',
      investments: '$100.55',
      expenses: '$60.50',
    },
    {
      name: 'Sarah Connor',
      deposits: '$120.00',
      withdrawals: '$95.00',
      investments: '$220.50',
      expenses: '$75.30',
    },
    {
      name: 'Bruce Wayne',
      deposits: '$200.00',
      withdrawals: '$150.00',
      investments: '$500.00',
      expenses: '$120.00',
    },
    {
      name: 'Diana Prince',
      deposits: '$85.50',
      withdrawals: '$70.00',
      investments: '$150.00',
      expenses: '$55.00',
    },
  ];

  const handleDownload = () => {
    console.log('Downloading transaction history...');
  };

  return (
    <div className="bg-[#0F0F0F] rounded-xl border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300 hover:shadow-2xl overflow-hidden">
      {/* Header with Tabs */}
      <div className="p-6 md:p-8 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-white text-xl font-semibold">
            Transaction History
          </h3>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] text-white rounded-lg border border-[#404040] hover:bg-[#404040] hover:border-[#5C5C5C] hover:shadow-lg transition-all duration-300 font-medium group"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-[#B3B3B3] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span>Download</span>
          </button>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="relative -mx-6 md:-mx-8 px-6 md:px-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max border-b border-[#2D2D2D]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-[#858585] hover:text-[#B3B3B3]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E8232C] to-[#C41E26] rounded-full shadow-lg shadow-[#E8232C]/50"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table - Scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2D2D2D]">
              <th className="text-left px-6 md:px-8 py-4 text-[#B3B3B3] text-xs font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="text-right px-4 py-4 text-[#B3B3B3] text-xs font-semibold uppercase tracking-wider">
                Deposits
              </th>
              <th className="text-right px-4 py-4 text-[#B3B3B3] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                Withdrawals
              </th>
              <th className="text-right px-4 py-4 text-[#B3B3B3] text-xs font-semibold uppercase tracking-wider">
                Investments
              </th>
              <th className="text-right px-6 md:px-8 py-4 text-[#B3B3B3] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                Expenses
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D2D2D]">
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="hover:bg-[#1A1A1A] transition-all duration-300 group cursor-pointer"
              >
                <td className="px-6 md:px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="ring-2 ring-transparent group-hover:ring-[#E8232C] transition-all duration-300 rounded-full">
                      <Avatar name={transaction.name} size="sm" />
                    </div>
                    <span className="text-white font-medium group-hover:text-[#E8232C] transition-colors duration-300">
                      {transaction.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[#4CAF50] font-semibold">
                    {transaction.deposits}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden sm:table-cell">
                  <span className="text-[#E8232C] font-semibold">
                    {transaction.withdrawals}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[#1E88E5] font-semibold">
                    {transaction.investments}
                  </span>
                </td>
                <td className="px-6 md:px-8 py-4 text-right hidden md:table-cell">
                  <span className="text-[#FB8C00] font-semibold">
                    {transaction.expenses}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Show hidden columns in expandable section */}
      <div className="sm:hidden px-6 py-4 bg-[#0F0F0F] border-t border-[#2D2D2D]">
        <p className="text-[#858585] text-xs text-center">
          Scroll horizontally or expand rows to see all data
        </p>
      </div>
    </div>
  );
};

export default TransactionHistory;
