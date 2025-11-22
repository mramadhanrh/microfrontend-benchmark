import React from 'react';
import WidgetHeader from '../atoms/WidgetHeader';
import BotMessage from '../molecules/BotMessage';
import MenuItem from '../molecules/MenuItem';
import { MenuItem as MenuItemType } from '../../types/support.types';

interface MenuViewProps {
  botName: string;
  greeting: string;
  message: string;
  avatarBg: string;
  menuItems: MenuItemType[];
  onBack: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMenuItemClick: (action: string) => void;
}

const MenuView: React.FC<MenuViewProps> = ({
  botName,
  greeting,
  message,
  avatarBg,
  menuItems,
  onBack,
  onClose,
  onMinimize,
  onMenuItemClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-80 max-w-[calc(100vw-2rem)] overflow-hidden animate-in fade-in slide-in-from-right-5 duration-300">
      <WidgetHeader
        title={botName}
        showBackButton
        showBadge
        onBack={onBack}
        onClose={onClose}
        onMinimize={onMinimize}
      />

      <div className="p-5 space-y-4">
        <BotMessage greeting={greeting} message={message} avatarBg={avatarBg} />

        <div className="space-y-2 pt-2">
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              label={item.label}
              onClick={() => onMenuItemClick(item.action)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuView;
