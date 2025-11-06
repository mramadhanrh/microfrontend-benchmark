interface BadgeProps {
  text: string;
  color: 'warm' | 'cold' | 'active' | 'push' | 'orange';
  size?: 'sm' | 'md';
}

const Badge = ({ text, color, size = 'md' }: BadgeProps) => {
  const colorClasses = {
    warm: 'bg-[#FB8C00] bg-opacity-10 text-[#FB8C00]',
    cold: 'bg-[#1E88E5] bg-opacity-10 text-[#1E88E5]',
    active: 'bg-[#00897B] bg-opacity-10 text-[#00897B]',
    push: 'bg-[#FB8C00] bg-opacity-10 text-[#FB8C00]',
    orange: 'bg-[#FB8C00] text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold transition-all duration-200 ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {text}
    </span>
  );
};

export default Badge;
