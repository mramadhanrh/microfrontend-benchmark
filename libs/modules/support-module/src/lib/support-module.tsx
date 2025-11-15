import SupportWidget from './components/organisms/SupportWidget';

export { default as SupportWidget } from './components/organisms/SupportWidget';
export { default as WelcomeView } from './components/organisms/WelcomeView';
export { default as MenuView } from './components/organisms/MenuView';
export { default as ConversationView } from './components/organisms/ConversationView';
export { default as ChatIconButton } from './components/atoms/ChatIconButton';
export { default as BotAvatar } from './components/atoms/BotAvatar';
export { default as SupportButton } from './components/atoms/SupportButton';
export { default as WidgetHeader } from './components/atoms/WidgetHeader';
export type * from './types/support.types';

/* eslint-disable-next-line */
export interface SupportModuleProps {}

export function SupportModule(props: SupportModuleProps) {
  return (
    <div className="relative">
      <SupportWidget />
    </div>
  );
}

export default SupportModule;
