import type { PropsWithChildren } from 'react';

interface SectionCardProps extends PropsWithChildren {
  className?: string;
}

const SectionCard = ({ children, className = '' }: SectionCardProps) => (
  <div
    className={`bg-[#2D2D2D] rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-300 ${className}`}
  >
    {children}
  </div>
);

export default SectionCard;
