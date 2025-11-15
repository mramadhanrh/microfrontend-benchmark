import React from 'react';

interface SupportButtonProps {
  variant?: 'primary' | 'secondary' | 'link';
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const SupportButton: React.FC<SupportButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  icon,
  fullWidth = false,
  className = '',
}) => {
  const baseClasses =
    'font-medium rounded-lg transition-all duration-200 ease-out flex items-center justify-center gap-2';

  const variantClasses = {
    primary:
      'bg-[#2D7A6E] text-white px-4 py-3 hover:bg-[#256456] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-98',
    secondary:
      'bg-[#1A1A1A] text-white px-4 py-3 hover:bg-[#333333] hover:shadow-md active:scale-98',
    link: 'text-[#666666] hover:text-[#2D7A6E] px-0 py-2 text-sm',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default SupportButton;
