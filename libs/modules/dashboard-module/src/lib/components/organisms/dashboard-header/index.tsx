import { ClockIcon } from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  dateLabel: string;
  userName: string;
  prompt: string;
  onToggleMobileSidebar: () => void;
}

const DashboardHeader = ({
  dateLabel,
  userName,
  prompt,
  onToggleMobileSidebar,
}: DashboardHeaderProps) => (
  <div className="mb-8">
    <button
      onClick={onToggleMobileSidebar}
      className="lg:hidden mb-4 p-2 text-[#B3B3B3] hover:bg-[#1A1A1A] hover:text-white rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95"
      aria-label="Toggle navigation menu"
    >
      <svg
        className="w-6 h-6 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-sm text-[#B3B3B3] mb-1 font-medium">{dateLabel}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-[#B3B3B3] bg-clip-text">
          Hello, {userName}
        </h1>
        <p className="text-[#858585] text-lg">{prompt}</p>
      </div>
      <button className="self-start sm:self-auto bg-[#2D2D2D] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 group">
        <ClockIcon className="w-6 h-6 text-[#E8232C] group-hover:text-[#C41E26] transition-colors" />
      </button>
    </div>
  </div>
);

export default DashboardHeader;
