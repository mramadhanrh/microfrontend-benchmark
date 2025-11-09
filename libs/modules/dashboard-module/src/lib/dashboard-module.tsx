import { useState } from 'react';
import Sidebar from './components/organisms/sidebar';
import DashboardHeader from './components/organisms/dashboard-header';
import DashboardContent from './components/organisms/dashboard-content';
import { TabContentType } from './types/tabs.type';

/* eslint-disable-next-line */
export interface DashboardModuleProps {}

export interface Task {
  name: string;
  priority: 'High' | 'Normal' | 'Low';
  dueDate: string;
  checkbox: boolean;
  completed?: boolean;
}

export interface TaskGroup {
  status: string;
  count: string;
  expanded: boolean;
  tasks: Task[];
  action: string;
}

export interface NavItem {
  id: string;
  icon: string;
  label?: string;
  badge?: number;
}

export interface Project {
  id?: string;
  name?: string;
  color: string;
}

export function DashboardModule(props: DashboardModuleProps) {
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navItems: NavItem[] = [
    { id: 'home', icon: 'house', label: 'Home' },
    { id: 'pin', icon: 'pushpin', label: 'Pinned' },
    { id: 'tasks', icon: 'clipboard', label: 'My tasks' },
    { id: 'inbox', icon: 'envelope', label: 'Inbox', badge: 3 },
    { id: 'calendar', icon: 'calendar', label: 'Calendar' },
    { id: 'analytics', icon: 'chart', label: 'Reports & Analytics' },
  ];

  const projects: Project[] = [
    { id: 'PL', name: 'Product launch', color: 'purple' },
    { id: 'TB', name: 'Team brainstorm', color: 'blue' },
    { id: 'BL', name: 'Branding launch', color: 'cyan' },
  ];

  const getColorClass = (color: string, type: 'bg' | 'text' = 'bg') => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      purple: { bg: 'bg-[#7B1FA2]', text: 'text-[#7B1FA2]' },
      blue: { bg: 'bg-[#1E88E5]', text: 'text-[#1E88E5]' },
      cyan: { bg: 'bg-[#00897B]', text: 'text-[#00897B]' },
      red: { bg: 'bg-[#E8232C]', text: 'text-[#E8232C]' },
      orange: { bg: 'bg-[#FB8C00]', text: 'text-[#FB8C00]' },
      gray: { bg: 'bg-[#858585]', text: 'text-[#858585]' },
    };
    return colorMap[color]?.[type] || colorMap.purple[type];
  };

  const handleNavSelect = (navId: string) => {
    setActiveNav(navId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleMobileToggle = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar
        navItems={navItems}
        projects={projects}
        activeNav={activeNav}
        isExpanded={isSidebarExpanded}
        isMobileOpen={isMobileSidebarOpen}
        onNavSelect={handleNavSelect}
        onExpandedChange={setIsSidebarExpanded}
        getColorClass={getColorClass}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <DashboardHeader
            dateLabel="Mon, July 7"
            userName="Courtney"
            prompt="How can I help you today?"
            onToggleMobileSidebar={handleMobileToggle}
          />

          <DashboardContent activeTab={TabContentType.Inbox} />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMobileSidebar}
        ></div>
      )}
    </div>
  );
}

export default DashboardModule;
