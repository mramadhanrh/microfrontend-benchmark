import { useState } from 'react';
import {
  HomeIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  InboxIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  StarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MapPinIcon as MapPinIconSolid,
  ClipboardDocumentListIcon as ClipboardIconSolid,
  InboxIcon as InboxIconSolid,
  CalendarIcon as CalendarIconSolid,
  ChartBarIcon as ChartIconSolid,
} from '@heroicons/react/24/solid';
import TaskSection from './components/task-section';

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

interface NavItem {
  id: string;
  icon: string;
  label?: string;
  badge?: number;
}

interface Project {
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

  const getIcon = (iconName: string, isSolid = false) => {
    const iconClass = 'w-6 h-6';
  const icons: Record<string, typeof HomeIcon> = {
      house: isSolid ? HomeIconSolid : HomeIcon,
      pushpin: isSolid ? MapPinIconSolid : MapPinIcon,
      clipboard: isSolid ? ClipboardIconSolid : ClipboardDocumentListIcon,
      envelope: isSolid ? InboxIconSolid : InboxIcon,
      calendar: isSolid ? CalendarIconSolid : CalendarIcon,
      chart: isSolid ? ChartIconSolid : ChartBarIcon,
      gear: Cog6ToothIcon,
      star: StarIcon,
      hourglass: ClockIcon,
    };

    const IconComponent = icons[iconName] || HomeIcon;
    return <IconComponent className={iconClass} />;
  };

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

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Expandable Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-[#0F0F0F] border-r border-[#2D2D2D] flex flex-col overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${
          isMobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
        ${isSidebarExpanded ? 'w-64' : 'w-20'}
      `}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* User Profile Header */}
        <div className="py-5 px-4 border-b border-[#2D2D2D] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E8232C] to-[#A01A20] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-lg">CH</span>
            </div>
            <div
              className={`transition-all duration-300 ${
                isSidebarExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <h3 className="font-semibold text-white whitespace-nowrap">
                Courtney Henry
              </h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43A047] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CAF50]"></span>
                </span>
                <span className="text-sm text-[#B3B3B3] whitespace-nowrap">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`
                  w-full flex items-center justify-between py-3 px-3 rounded-lg 
                  transition-all duration-200 group
                  ${
                    activeNav === item.id
                      ? 'bg-[#2D2D2D] text-[#E8232C] shadow-sm'
                      : 'text-[#B3B3B3] hover:bg-[#1A1A1A] hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0 w-6 h-6 transition-transform duration-200 group-hover:scale-110">
                    {getIcon(item.icon, activeNav === item.id)}
                    {item.badge && !isSidebarExpanded && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E8232C] text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-medium whitespace-nowrap transition-all duration-300 ${
                      isSidebarExpanded
                        ? 'opacity-100 w-auto'
                        : 'opacity-0 w-0 overflow-hidden'
                    }`}
                  >
                    {item.label || item.id}
                  </span>
                </div>
                <span
                  className={`bg-[#E8232C] text-white text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 flex-shrink-0 ${
                    item.badge && isSidebarExpanded
                      ? 'opacity-100 w-auto'
                      : 'opacity-0 w-0 overflow-hidden'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Projects Section */}
          <div className="mt-6 px-2">
            <div
              className={`flex items-center justify-between px-3 mb-2 transition-all duration-300 ${
                isSidebarExpanded
                  ? 'opacity-100 h-auto'
                  : 'opacity-0 h-0 overflow-hidden'
              }`}
            >
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                My Projects
              </h4>
              <button className="text-[#E8232C] hover:text-[#C41E26] text-xs font-medium whitespace-nowrap transition-transform duration-200 hover:scale-105">
                + Add
              </button>
            </div>
            <div
              className={`px-3 mb-2 transition-all duration-300 ${
                isSidebarExpanded
                  ? 'opacity-0 h-0 overflow-hidden'
                  : 'opacity-100 h-auto'
              }`}
            >
              <div className="h-px bg-[#2D2D2D]"></div>
            </div>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-all duration-200 group"
                >
                  <div
                    className={`flex-shrink-0 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${
                      isSidebarExpanded
                        ? 'w-3 h-3 text-[0px]'
                        : 'w-10 h-10 text-sm'
                    } ${getColorClass(project.color)} text-white`}
                  >
                    {!isSidebarExpanded && project.id}
                  </div>
                  <span
                    className={`text-[#B3B3B3] font-medium whitespace-nowrap transition-all duration-300 group-hover:text-white ${
                      isSidebarExpanded
                        ? 'opacity-100 w-auto'
                        : 'opacity-0 w-0 overflow-hidden'
                    }`}
                  >
                    {project.name}
                  </span>
                </button>
              ))}
              <button className="w-full flex items-center gap-3 px-3 py-2.5 group">
                <div
                  className={`flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[#E8232C] ${
                    isSidebarExpanded
                      ? 'w-0 h-0 opacity-0'
                      : 'w-10 h-10 opacity-100'
                  } border-2 border-dashed border-[#404040] text-[#858585] group-hover:text-[#E8232C]`}
                >
                  {!isSidebarExpanded && <PlusIcon className="w-5 h-5" />}
                </div>
                <span
                  className={`text-[#E8232C] hover:text-[#C41E26] text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isSidebarExpanded
                      ? 'opacity-100 w-auto'
                      : 'opacity-0 w-0 overflow-hidden'
                  }`}
                >
                  + Add Project
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className="py-4 px-2 border-t border-[#2D2D2D] flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#B3B3B3] hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 group">
            <Cog6ToothIcon className="w-6 h-6 flex-shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isSidebarExpanded
                  ? 'opacity-100 w-auto'
                  : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden mb-4 p-2 text-[#B3B3B3] hover:bg-[#1A1A1A] hover:text-white rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <svg
              className="w-6 h-6 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-[#B3B3B3] mb-1 font-medium">
                  Mon, July 7
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-[#B3B3B3] bg-clip-text">
                  Hello, Courtney
                </h1>
                <p className="text-[#858585] text-lg">
                  How can I help you today?
                </p>
              </div>
              <button className="self-start sm:self-auto bg-[#2D2D2D] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 group">
                <ClockIcon className="w-6 h-6 text-[#E8232C] group-hover:text-[#C41E26] transition-colors" />
              </button>
            </div>
          </div>

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
          onClick={() => {
            setIsMobileSidebarOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default DashboardModule;
