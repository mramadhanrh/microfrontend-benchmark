import React from 'react';

interface ChatIconButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatIconButton: React.FC<ChatIconButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-[#E8232C] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 active:scale-95 z-50 ${
        isOpen ? 'rotate-90 scale-90' : 'rotate-0 scale-100'
      }`}
      aria-label="Open support chat"
    >
      <svg
        className={`w-6 h-6 text-white transition-all duration-300 ${
          isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
        }`}
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
      <svg
        className={`w-6 h-6 text-white absolute transition-all duration-300 ${
          isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default ChatIconButton;
