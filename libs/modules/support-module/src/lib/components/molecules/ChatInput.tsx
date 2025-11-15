import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Write a reply...',
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 bg-[#F5F5F5] rounded-lg text-[#1A1A1A] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#2D7A6E] focus:ring-opacity-20 transition-all duration-150"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#2D7A6E] transition-colors duration-200"
        aria-label="Attach file"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
