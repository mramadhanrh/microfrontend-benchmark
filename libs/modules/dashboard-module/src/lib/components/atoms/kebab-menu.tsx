import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface KebabMenuOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface KebabMenuProps {
  options: KebabMenuOption[];
  onSelect: (value: string) => void;
}

const KebabMenu = ({ options, onSelect }: KebabMenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 text-[#858585] hover:text-white hover:bg-[#2D2D2D] rounded-lg transition-all duration-200 group">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-[#1A1A1A] rounded-lg p-1 shadow-2xl border border-[#2D2D2D] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50"
          sideOffset={5}
          align="end"
        >
          {options.map((option, index) => (
            <div key={option.value}>
              {index > 0 && option.variant === 'danger' && (
                <DropdownMenu.Separator className="h-px bg-[#2D2D2D] my-1" />
              )}
              <DropdownMenu.Item
                className={`group flex items-center gap-2 px-3 py-2.5 text-sm rounded-md outline-none cursor-pointer transition-all duration-150 ease-out ${
                  option.variant === 'danger'
                    ? 'text-[#E8232C] hover:bg-[#E8232C] hover:bg-opacity-10'
                    : 'text-[#B3B3B3] hover:bg-[#2D2D2D] hover:text-white'
                }`}
                onSelect={() => onSelect(option.value)}
              >
                {option.icon && (
                  <span className="w-5 h-5 transition-colors duration-150">
                    {option.icon}
                  </span>
                )}
                <span className="font-medium">{option.label}</span>
              </DropdownMenu.Item>
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default KebabMenu;
