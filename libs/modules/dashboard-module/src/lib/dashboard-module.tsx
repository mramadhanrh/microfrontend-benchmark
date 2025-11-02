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

/* eslint-disable-next-line */
export interface DashboardModuleProps {}

interface Task {
  name: string;
  priority: 'High' | 'Normal' | 'Low';
  dueDate: string;
  checkbox: boolean;
  completed?: boolean;
}

interface TaskGroup {
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
      action: '+ Add task',
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
      action: '+ Add task',
    },
  ]);

  const navItems: NavItem[] = [
    { id: 'home', icon: 'house', label: 'Home' },
    { id: 'pin', icon: 'pushpin' },
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
    const icons: { [key: string]: any } = {
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
      purple: { bg: 'bg-purple-500', text: 'text-purple-500' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500' },
      red: { bg: 'bg-red-500', text: 'text-red-500' },
      gray: { bg: 'bg-gray-400', text: 'text-gray-400' },
    };
    return colorMap[color]?.[type] || colorMap.purple[type];
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      High: 'red',
      Normal: 'blue',
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
    <div className="flex h-screen bg-amber-50 overflow-hidden">
      {/* Expandable Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r border-gray-200 flex flex-col overflow-hidden
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
        <div className="py-5 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-lg">CH</span>
            </div>
            <div
              className={`transition-all duration-300 ${
                isSidebarExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <h3 className="font-semibold text-gray-900 whitespace-nowrap">
                Courtney Henry
              </h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-500 whitespace-nowrap">
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
                      ? 'bg-purple-50 text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0 w-6 h-6 transition-transform duration-200 group-hover:scale-110">
                    {getIcon(item.icon, activeNav === item.id)}
                    {item.badge && !isSidebarExpanded && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-sm animate-pulse">
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
                  className={`bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 flex-shrink-0 ${
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
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                My Projects
              </h4>
              <button className="text-purple-600 hover:text-purple-700 text-xs font-medium whitespace-nowrap transition-transform duration-200 hover:scale-105">
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
              <div className="h-px bg-gray-200"></div>
            </div>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
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
                    className={`text-gray-700 font-medium whitespace-nowrap transition-all duration-300 group-hover:text-gray-900 ${
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
                  className={`flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-purple-300 ${
                    isSidebarExpanded
                      ? 'w-0 h-0 opacity-0'
                      : 'w-10 h-10 opacity-100'
                  } border-2 border-dashed border-gray-300 text-gray-400 group-hover:text-purple-500`}
                >
                  {!isSidebarExpanded && <PlusIcon className="w-5 h-5" />}
                </div>
                <span
                  className={`text-purple-600 hover:text-purple-700 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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
        <div className="py-4 px-2 border-t border-gray-200 flex-shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
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
            className="lg:hidden mb-4 p-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95"
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
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  Mon, July 7
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  Hello, Courtney
                </h1>
                <p className="text-gray-600 text-lg">
                  How can I help you today?
                </p>
              </div>
              <button className="self-start sm:self-auto bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 group">
                <ClockIcon className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors" />
              </button>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            </div>

            {/* Task Groups */}
            <div className="space-y-4">
              {taskGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleTaskGroup(groupIndex)}
                    className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-gray-700 ${
                          group.expanded ? 'rotate-90' : ''
                        }`}
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
                      <span className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                        {group.status}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {group.count}
                      </span>
                    </div>
                  </button>

                  {/* Tasks List */}
                  {group.expanded && (
                    <div className="divide-y divide-gray-100">
                      {group.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="px-6 py-4 hover:bg-gray-50 transition-all duration-200 group"
                        >
                          <div className="flex items-start space-x-4">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() =>
                                toggleTaskCompletion(groupIndex, taskIndex)
                              }
                              className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transition-all duration-200 hover:scale-110"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium mb-2 transition-all duration-300 ${
                                  task.completed
                                    ? 'line-through text-gray-400'
                                    : 'text-gray-900 group-hover:text-purple-600'
                                }`}
                              >
                                {task.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${getColorClass(
                                    getPriorityColor(task.priority),
                                    'text'
                                  )} bg-opacity-10`}
                                  style={{
                                    backgroundColor: `var(--${getPriorityColor(
                                      task.priority
                                    )}-50)`,
                                  }}
                                >
                                  {task.priority}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1 transition-colors duration-200 group-hover:text-gray-700">
                                  <CalendarIcon className="w-4 h-4" />
                                  {task.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Task Button */}
                      <button className="w-full px-6 py-4 text-left text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium group hover:px-7">
                        <span className="inline-flex items-center gap-2">
                          <PlusIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                          {group.action}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => {
            setIsMobileSidebarOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default DashboardModule;
