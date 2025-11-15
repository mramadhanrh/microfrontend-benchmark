import React, { useState } from 'react';
import ChatIconButton from '../atoms/ChatIconButton';
import WelcomeView from '../organisms/WelcomeView';
import MenuView from '../organisms/MenuView';
import ConversationView from '../organisms/ConversationView';
import {
  SupportWidgetView,
  Message,
  MenuItem,
  SupportConfig,
} from '../../types/support.types';

interface SupportWidgetProps {
  config?: Partial<SupportConfig>;
}

const defaultConfig: SupportConfig = {
  brand: 'Attic',
  subtitle: 'Support',
  botName: 'Paul bot',
  greeting: 'Hi Dina 👋',
  welcomeMessage:
    "Hope your day is going great.\nI'm Paul, Attic Bot.\nAsk me anything or share your feedback.",
  theme: {
    primaryColor: '#E8232C',
    backgroundColor: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    borderColor: '#E0E0E0',
    avatarBg: '#F4A261',
  },
};

const defaultMenuItems: MenuItem[] = [
  { id: '1', label: 'Need a help using product', action: 'help' },
  { id: '2', label: 'Want to submit a bug', action: 'bug' },
  { id: '3', label: 'Want to talk to sales', action: 'sales' },
  { id: '4', label: 'Have another question', action: 'question' },
];

const SupportWidget: React.FC<SupportWidgetProps> = ({ config = {} }) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const [currentView, setCurrentView] = useState<SupportWidgetView>('hidden');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Sure! Please try to describe your problem so our support will be able to answer in more relevant way.',
      timestamp: null,
    },
    {
      id: '2',
      type: 'user',
      text: 'Hi there! I have an issue with connecting my app to Attic. Could you please take a look at my case?',
      timestamp: 'Seen by a human 2 mins ago',
    },
  ]);

  const handleToggleWidget = () => {
    if (currentView === 'hidden') {
      setCurrentView('welcome');
    } else {
      setCurrentView('hidden');
    }
  };

  const handleStartConversation = () => {
    setCurrentView('menu');
  };

  const handleMenuItemClick = (action: string) => {
    console.log('Menu action:', action);
    setCurrentView('conversation');
  };

  const handleBackFromMenu = () => {
    setCurrentView('welcome');
  };

  const handleBackFromConversation = () => {
    setCurrentView('menu');
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: 'Just now',
    };
    setMessages([...messages, newMessage]);
  };

  const handleAnotherQuestion = () => {
    setCurrentView('menu');
  };

  const handleClose = () => {
    setCurrentView('hidden');
  };

  const handleMinimize = () => {
    setCurrentView('hidden');
  };

  return (
    <>
      {/* Chat Icon Button */}
      <ChatIconButton
        onClick={handleToggleWidget}
        isOpen={currentView !== 'hidden'}
      />

      {/* Widget Container */}
      {currentView !== 'hidden' && (
        <div className="fixed bottom-24 right-6 z-50">
          {currentView === 'welcome' && (
            <WelcomeView
              brand={mergedConfig.brand}
              subtitle={mergedConfig.subtitle}
              greeting={mergedConfig.greeting}
              message={mergedConfig.welcomeMessage}
              avatarBg={mergedConfig.theme.avatarBg}
              onStartConversation={handleStartConversation}
              onClose={handleClose}
              onMinimize={handleMinimize}
            />
          )}

          {currentView === 'menu' && (
            <MenuView
              botName={mergedConfig.botName}
              greeting={mergedConfig.greeting}
              message={mergedConfig.welcomeMessage}
              avatarBg={mergedConfig.theme.avatarBg}
              menuItems={defaultMenuItems}
              onBack={handleBackFromMenu}
              onClose={handleClose}
              onMinimize={handleMinimize}
              onMenuItemClick={handleMenuItemClick}
            />
          )}

          {currentView === 'conversation' && (
            <ConversationView
              botName={mergedConfig.botName}
              avatarBg={mergedConfig.theme.avatarBg}
              messages={messages}
              onBack={handleBackFromConversation}
              onClose={handleClose}
              onMinimize={handleMinimize}
              onSendMessage={handleSendMessage}
              onAnotherQuestion={handleAnotherQuestion}
            />
          )}
        </div>
      )}

      {/* Backdrop */}
      {currentView !== 'hidden' && (
        <div
          className="fixed inset-0 bg-black/0 z-40 animate-in fade-in duration-500"
          style={{
            animation: 'backdropFadeIn 0.15s ease-out forwards',
            backdropFilter: 'blur(0px)',
          }}
          onClick={handleClose}
        >
          <style>{`
            @keyframes backdropFadeIn {
              from {
                background-color: rgba(0, 0, 0, 0);
                backdrop-filter: blur(0px);
              }
              to {
                background-color: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(4px);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default SupportWidget;
