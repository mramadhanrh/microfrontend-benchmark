import React from 'react';
import BotAvatar from '../atoms/BotAvatar';

interface ChatMessageProps {
  type: 'bot' | 'user';
  text: string;
  timestamp?: string | null;
  avatarBg?: string;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  text,
  timestamp,
  avatarBg = '#F4A261',
  index,
}) => {
  if (type === 'bot') {
    return (
      <div
        className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-3 duration-500"
        style={{
          animationDelay: `${index * 150}ms`,
          animationFillMode: 'backwards',
        }}
      >
        <BotAvatar size="sm" backgroundColor={avatarBg} />
        <div className="flex-1">
          <div className="bg-[#F5F5F5] rounded-lg rounded-tl-none px-4 py-3">
            <p className="text-[#1A1A1A] text-sm leading-relaxed">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-end animate-in fade-in slide-in-from-bottom-3 duration-500"
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <div className="bg-[#E8232C] text-white rounded-lg rounded-tr-none px-4 py-3 max-w-[80%]">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      {timestamp && (
        <p className="text-xs text-[#666666] mt-1 px-1">{timestamp}</p>
      )}
    </div>
  );
};

export default ChatMessage;
