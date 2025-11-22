import React from 'react';

interface MenuItemProps {
  label: string;
  onClick: () => void;
  index: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, index }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 text-[#1A1A1A] text-sm bg-[#F5F5F5] rounded-lg hover:bg-[#E8E8E8] hover:translate-x-1 transition-all duration-200 ease-out animate-in fade-in slide-in-from-left-2"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {label}
    </button>
  );
};

export default MenuItem;
