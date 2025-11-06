import type { PropsWithChildren } from 'react';

interface IconBadgeProps extends PropsWithChildren {
  className?: string;
}

const IconBadge = ({ children, className = '' }: IconBadgeProps) => (
  <div className={`p-2 bg-[#404040] rounded-lg ${className}`}>{children}</div>
);

export default IconBadge;
