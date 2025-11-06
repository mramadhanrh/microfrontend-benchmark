import { useState } from 'react';
import TaskSection from './components/organisms/task-section/task-section';
import Sidebar from './components/organisms/sidebar/sidebar';
import DashboardHeader from './components/organisms/dashboard-header/dashboard-header';

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
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
    {
      status: 'IN PROGRESS',
      count: '3 tasks',
      expanded: true,
      tasks: [
        {
          name: 'One-on-One Meeting',
          priority: 'High',
          dueDate: 'Today',
          checkbox: true,
          completed: false,
        },
        {
          name: 'Send a summary email to stakeholders',
          priority: 'Low',
          dueDate: '3 days left',
          checkbox: true,
          completed: false,
        },
        {
          name: 'Identify any blockers and plan solutions',
          priority: 'Low',
          dueDate: '5 days left',
          checkbox: true,
          completed: false,
        },
      ],
      action: 'Add task',
    },
    {
      status: 'TO DO',
      count: '1 task',
      expanded: true,
      tasks: [
        {
          name: 'Communication with a team',
          priority: 'Normal',
          dueDate: '4 days left',
          checkbox: true,
          completed: false,
        },
      ],
      action: 'Add task',
    },
  ]);

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

  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      High: 'red',
      Normal: 'orange',
      Low: 'gray',
    };
    return priorityMap[priority] || 'gray';
  };

  const toggleTaskGroup = (groupIndex: number) => {
    setTaskGroups(
      taskGroups.map((group, idx) =>
        idx === groupIndex ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const toggleTaskCompletion = (groupIndex: number, taskIndex: number) => {
    setTaskGroups(
      taskGroups.map((group, gIdx) =>
        gIdx === groupIndex
          ? {
              ...group,
              tasks: group.tasks.map((task, tIdx) =>
                tIdx === taskIndex
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : group
      )
    );
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

          <TaskSection
            taskGroups={taskGroups}
            onToggleGroup={toggleTaskGroup}
            onToggleTaskCompletion={toggleTaskCompletion}
            getColorClass={getColorClass}
            getPriorityColor={getPriorityColor}
          />
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
