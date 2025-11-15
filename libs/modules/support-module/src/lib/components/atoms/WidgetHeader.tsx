import React from 'react';

interface WidgetHeaderProps {
  brand?: string;
  subtitle?: string;
  title?: string;
  showBackButton?: boolean;
  showBadge?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  brand,
  subtitle,
  title,
  showBackButton = false,
  showBadge = false,
  onBack,
  onClose,
  onMinimize,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
      <div className="flex items-center gap-3">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="text-[#666666] hover:text-[#1A1A1A] transition-colors duration-200"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2">
          {brand && (
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">{brand}</h2>
              {subtitle && <p className="text-xs text-[#666666]">{subtitle}</p>}
            </div>
          )}
          {title && (
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-[#1A1A1A]">{title}</h2>
              {showBadge && (
                <span className="w-2 h-2 bg-[#00C853] rounded-full"></span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="text-[#666666] hover:text-[#1A1A1A] transition-colors duration-200 p-1"
            aria-label="Minimize"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#1A1A1A] transition-colors duration-200 p-1"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default WidgetHeader;
