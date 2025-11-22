import React from 'react';
import WidgetHeader from '../atoms/WidgetHeader';
import ChatMessage from '../molecules/ChatMessage';
import ChatInput from '../molecules/ChatInput';
import SupportButton from '../atoms/SupportButton';
import { Message } from '../../types/support.types';

interface ConversationViewProps {
  botName: string;
  avatarBg: string;
  messages: Message[];
  statusText?: string;
  onBack: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onSendMessage: (message: string) => void;
  onAnotherQuestion: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  botName,
  avatarBg,
  messages,
  statusText = 'Please wait until consultant review your issue...',
  onBack,
  onClose,
  onMinimize,
  onSendMessage,
  onAnotherQuestion,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-80 max-w-[calc(100vw-2rem)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-5">
      <WidgetHeader
        title={botName}
        showBackButton
        showBadge
        onBack={onBack}
        onClose={onClose}
        onMinimize={onMinimize}
      />

      <div className="flex flex-col h-[400px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              text={message.text}
              timestamp={message.timestamp}
              avatarBg={avatarBg}
              index={index}
            />
          ))}
        </div>

        {/* Status */}
        {statusText && (
          <div className="px-5 pb-3 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 text-xs text-[#666666]">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{statusText}</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-5 space-y-3 border-t border-[#E0E0E0]">
          <ChatInput onSend={onSendMessage} />
          <SupportButton
            variant="primary"
            fullWidth
            onClick={onAnotherQuestion}
            className="text-sm"
          >
            Have another question
          </SupportButton>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
