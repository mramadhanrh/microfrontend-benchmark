import { ChevronDownIcon } from '@heroicons/react/24/outline';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  label: string;
  icon?: React.ReactNode;
  options?: DropdownOption[];
  onSelect?: (value: string) => void;
}

const Dropdown = ({ label, icon, options = [], onSelect }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] text-white rounded-lg border border-[#404040] hover:bg-[#404040] hover:border-[#5C5C5C] transition-all duration-200 font-medium group">
          {icon && (
            <span className="w-5 h-5 text-[#B3B3B3] group-hover:text-white transition-colors duration-200">
              {icon}
            </span>
          )}
          <span>{label}</span>
          <ChevronDownIcon className="w-4 h-4 text-[#858585] group-hover:text-[#B3B3B3] transition-all duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-[#1A1A1A] rounded-lg p-1 shadow-2xl border border-[#2D2D2D] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50"
          sideOffset={5}
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              className="group flex items-center gap-2 px-3 py-2.5 text-sm text-[#B3B3B3] rounded-md outline-none cursor-pointer hover:bg-[#2D2D2D] hover:text-white transition-all duration-150 ease-out"
              onSelect={() => onSelect?.(option.value)}
            >
              {option.icon && (
                <span className="w-5 h-5 text-[#858585] group-hover:text-white transition-colors duration-150">
                  {option.icon}
                </span>
              )}
              <span className="font-medium">{option.label}</span>
            </DropdownMenu.Item>
          ))}

          {options.length === 0 && (
            <div className="px-3 py-2.5 text-sm text-[#858585] text-center">
              No options available
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
