import { useState } from 'react';
import KebabMenu from '../../atoms/kebab-menu';
import {
  PaperAirplaneIcon,
  HeartIcon,
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

interface SavingItem {
  id: string;
  icon: 'airplane' | 'ring' | 'school';
  label: string;
  description: string;
  amount: string;
  progress: number;
  progressColor: string;
  active: boolean;
}

const SavingsCard = () => {
  const [savingsItems, setSavingsItems] = useState<SavingItem[]>([
    {
      id: '1',
      icon: 'airplane',
      label: 'Travel',
      description: 'Vestibulum in 2 months',
      amount: '$25,875',
      progress: 85,
      progressColor: '#1a4d4d',
      active: true,
    },
    {
      id: '2',
      icon: 'ring',
      label: 'Married',
      description: 'Vestibulum in 6 months',
      amount: '$30,570',
      progress: 65,
      progressColor: '#8ab5b5',
      active: false,
    },
    {
      id: '3',
      icon: 'school',
      label: 'College',
      description: 'Vestibulum in 8 months',
      amount: '$31,375',
      progress: 45,
      progressColor: '#b5d4d4',
      active: false,
    },
  ]);

  const totalBalance = '$25,875.00';
  const trend = { percentage: '1%', type: 'positive' };

  const iconMap = {
    airplane: PaperAirplaneIcon,
    ring: HeartIcon,
    school: AcademicCapIcon,
  };

  const handleMenuAction = (action: string, itemId: string) => {
    console.log(`Action: ${action} for item: ${itemId}`);

    switch (action) {
      case 'edit':
        // Handle edit
        break;
      case 'delete':
        setSavingsItems(savingsItems.filter((item) => item.id !== itemId));
        break;
      case 'refresh':
        // Handle refresh
        break;
      default:
        break;
    }
  };

  const menuOptions = [
    {
      label: 'Edit Goal',
      value: 'edit',
      icon: <PencilIcon className="w-5 h-5" />,
    },
    {
      label: 'Refresh Progress',
      value: 'refresh',
      icon: <ArrowPathIcon className="w-5 h-5" />,
    },
    {
      label: 'Delete Goal',
      value: 'delete',
      icon: <TrashIcon className="w-5 h-5" />,
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="bg-[#0F0F0F] rounded-xl p-6 md:p-8 border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-white text-xl font-semibold mb-1">Savings</h3>
          <p className="text-[#858585] text-sm">Total Balance</p>
        </div>
        <KebabMenu
          options={[
            {
              label: 'Add New Goal',
              value: 'add',
              icon: <PlusIcon className="w-5 h-5" />,
            },
            {
              label: 'Manage Goals',
              value: 'manage',
              icon: <PencilIcon className="w-5 h-5" />,
            },
          ]}
          onSelect={(action) => console.log(action)}
        />
      </div>

      {/* Total Balance */}
      <div className="mb-6 p-4 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-lg border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-2xl font-bold mb-1">{totalBalance}</p>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 text-[#4CAF50] bg-[#4CAF50] bg-opacity-10 px-2 py-0.5 rounded-full">
                <ArrowUpIcon className="w-3 h-3" />
                <span className="text-xs font-semibold">
                  {trend.percentage}
                </span>
              </div>
              <span className="text-[#858585] text-xs">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Goals List */}
      <div className="space-y-4">
        {savingsItems.map((item, index) => {
          const IconComponent = iconMap[item.icon];

          return (
            <div
              key={item.id}
              className={`group p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                item.active
                  ? 'bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#404040] hover:border-[#5C5C5C]'
                  : 'bg-[#0F0F0F] border-[#2D2D2D] hover:border-[#404040] hover:bg-[#1A1A1A]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                      item.active ? 'bg-[#E8232C]' : 'bg-[#2D2D2D]'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        item.active
                          ? 'text-white'
                          : 'text-[#858585] group-hover:text-white'
                      } transition-colors duration-300`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold mb-0.5 transition-colors duration-300 ${
                        item.active
                          ? 'text-white'
                          : 'text-[#B3B3B3] group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-[#858585] text-xs">{item.description}</p>
                  </div>
                </div>

                {/* Amount & Menu */}
                <div className="flex items-center gap-2 ml-2">
                  <span
                    className={`text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                      item.active
                        ? 'text-[#4CAF50]'
                        : 'text-[#B3B3B3] group-hover:text-white'
                    }`}
                  >
                    {item.amount}
                  </span>
                  <KebabMenu
                    options={menuOptions}
                    onSelect={(action) => handleMenuAction(action, item.id)}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#858585]">Progress</span>
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      item.active ? 'text-white' : 'text-[#B3B3B3]'
                    }`}
                  >
                    {item.progress}%
                  </span>
                </div>
                <div className="h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.progressColor,
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Goal Button */}
      <button className="w-full mt-4 p-4 border-2 border-dashed border-[#2D2D2D] rounded-lg text-[#858585] hover:border-[#E8232C] hover:text-[#E8232C] hover:bg-[#E8232C] hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center gap-2 group">
        <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-medium">Add New Goal</span>
      </button>
    </div>
  );
};

export default SavingsCard;
