import { PlusIcon } from '@heroicons/react/24/outline';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: 'plus' | 'none';
  onClick?: () => void;
  className?: string;
}

const Button = ({
  label,
  variant = 'primary',
  icon = 'none',
  onClick,
  className = '',
}: ButtonProps) => {
  const variantClasses = {
    primary:
      'bg-[#E8232C] text-white hover:bg-[#C41E26] active:bg-[#A01A20] font-bold',
    secondary:
      'bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-10',
    ghost: 'bg-transparent text-white hover:bg-white hover:bg-opacity-10',
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className}`}
    >
      {icon === 'plus' && <PlusIcon className="w-5 h-5" />}
      <span>{label}</span>
    </button>
  );
};

export default Button;
