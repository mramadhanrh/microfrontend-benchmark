import { ArrowUpIcon } from '@heroicons/react/24/solid';

const BalanceCard = () => {
  return (
    <div className="bg-[#0F0F0F] rounded-xl p-6 md:p-8 border border-[#2D2D2D] hover:border-[#404040] transition-all duration-300 hover:shadow-2xl group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-[#B3B3B3] text-sm font-medium">Balance</h3>
          <div className="flex items-center gap-1.5 text-[#4CAF50] bg-[#4CAF50] bg-opacity-10 px-2.5 py-1 rounded-full transition-all duration-300 group-hover:bg-opacity-20">
            <ArrowUpIcon className="w-3 h-3" />
            <span className="text-xs font-semibold">2.5%</span>
            <span className="text-xs font-medium">Last month</span>
          </div>
        </div>

        {/* Main Balance */}
        <div className="relative">
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500 group-hover:scale-105 inline-block">
            $32,584.00
          </h2>
          <div className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-[#E8232C] to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
