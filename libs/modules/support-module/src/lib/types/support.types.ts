export type SupportWidgetView = 'hidden' | 'welcome' | 'menu' | 'conversation';

export interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  timestamp?: string | null;
  avatar?: {
    type: 'icon' | 'image';
    backgroundColor?: string;
    icon?: string;
    imageUrl?: string;
  };
}

export interface MenuItem {
  id: string;
  label: string;
  action: string;
}

export interface SupportConfig {
  brand: string;
  subtitle: string;
  botName: string;
  greeting: string;
  welcomeMessage: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    avatarBg: string;
  };
}
