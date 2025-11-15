import React from 'react';
import BotAvatar from '../atoms/BotAvatar';

interface BotMessageProps {
  greeting: string;
  message: string;
  avatarBg?: string;
}

const BotMessage: React.FC<BotMessageProps> = ({
  greeting,
  message,
  avatarBg = '#F4A261',
}) => {
  return (
    <div className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BotAvatar backgroundColor={avatarBg} />
      <div className="flex-1">
        <p className="text-[#1A1A1A] font-medium mb-1">{greeting}</p>
        <p className="text-[#666666] text-sm leading-relaxed whitespace-pre-line">
          {message}
        </p>
      </div>
    </div>
  );
};

export default BotMessage;
