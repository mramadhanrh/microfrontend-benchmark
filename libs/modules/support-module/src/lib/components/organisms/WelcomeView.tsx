import React from 'react';
import WidgetHeader from '../atoms/WidgetHeader';
import BotMessage from '../molecules/BotMessage';
import SupportButton from '../atoms/SupportButton';

interface WelcomeViewProps {
  brand: string;
  subtitle: string;
  greeting: string;
  message: string;
  avatarBg: string;
  onStartConversation: () => void;
  onClose: () => void;
  onMinimize: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({
  brand,
  subtitle,
  greeting,
  message,
  avatarBg,
  onStartConversation,
  onClose,
  onMinimize,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-80 max-w-[calc(100vw-2rem)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-8">
      <WidgetHeader
        brand={brand}
        subtitle={subtitle}
        onClose={onClose}
        onMinimize={onMinimize}
      />

      <div className="p-5 space-y-4">
        <BotMessage greeting={greeting} message={message} avatarBg={avatarBg} />

        <div className="space-y-3 pt-2">
          <SupportButton
            variant="primary"
            fullWidth
            onClick={onStartConversation}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
          >
            Start a conversation
          </SupportButton>

          <SupportButton
            variant="link"
            fullWidth
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            }
          >
            See all your conversations
          </SupportButton>
        </div>

        <div className="pt-4 border-t border-[#E0E0E0] space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">
              Book a demo
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Get a look inside Attic to discover everything it can do for you.
            </p>
          </div>
          <SupportButton variant="secondary" fullWidth>
            Send a request
          </SupportButton>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
