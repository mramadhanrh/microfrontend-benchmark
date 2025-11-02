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
        bg-white border-r border-gray-200 flex flex-col
        transform transition-all duration-300 ease-in-out
        ${
          isMobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
        ${isSidebarExpanded ? 'w-72' : 'w-20'}
      `}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* User Profile Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-lg">CH</span>
            </div>
            {isSidebarExpanded && (
              <div className="overflow-hidden">
                <h3 className="font-semibold text-gray-900 whitespace-nowrap">
                  Courtney Henry
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`
                  w-full flex items-center ${
                    isSidebarExpanded ? 'justify-between' : 'justify-center'
                  } px-3 py-3 rounded-lg transition-colors
                  ${
                    activeNav === item.id
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    {getIcon(item.icon, activeNav === item.id)}
                    {item.badge && !isSidebarExpanded && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isSidebarExpanded && (
                    <span className="font-medium whitespace-nowrap">
                      {item.label || item.id}
                    </span>
                  )}
                </div>
                {item.badge && isSidebarExpanded && (
                  <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Projects Section */}
          <div className="mt-6 px-3">
            {isSidebarExpanded && (
              <div className="flex items-center justify-between px-4 py-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  My Projects
                </h4>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  + Add
                </button>
              </div>
            )}
            {!isSidebarExpanded && (
              <div className="px-4 py-2 text-center">
                <div className="h-px bg-gray-200 my-2"></div>
              </div>
            )}
            <div className="space-y-1 mt-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className={`w-full flex items-center space-x-3 ${
                    isSidebarExpanded ? 'px-4' : 'px-3 justify-center'
                  } py-3 rounded-lg hover:bg-gray-50 transition-colors`}
                >
                  {isSidebarExpanded ? (
                    <>
                      <div
                        className={`w-3 h-3 ${getColorClass(
                          project.color
                        )} rounded-full flex-shrink-0`}
                      ></div>
                      <span className="text-gray-700 font-medium whitespace-nowrap">
                        {project.name}
                      </span>
                    </>
                  ) : (
                    <div
                      className={`w-10 h-10 ${getColorClass(
                        project.color
                      )} text-white rounded-lg flex items-center justify-center font-semibold text-sm hover:opacity-80 transition-opacity`}
                    >
                      {project.id}
                    </div>
                  )}
                </button>
              ))}
              <button
                className={`w-full flex items-center ${
                  isSidebarExpanded
                    ? 'px-4 justify-start'
                    : 'px-3 justify-center'
                } py-3`}
              >
                {isSidebarExpanded ? (
                  <span className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    + Add Project
                  </span>
                ) : (
                  <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200">
          <button
            className={`w-full flex items-center space-x-3 ${
              isSidebarExpanded ? 'px-4' : 'px-3 justify-center'
            } py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors`}
          >
            <Cog6ToothIcon className="w-6 h-6 flex-shrink-0" />
            {isSidebarExpanded && (
              <span className="font-medium whitespace-nowrap">Settings</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden mb-4 p-2 text-gray-600 hover:bg-white rounded-lg"
          >
            <svg
              className="w-6 h-6"
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
                <p className="text-sm text-gray-500 mb-1">Mon, July 7</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Hello, Courtney
                </h1>
                <p className="text-gray-600">How can I help you today?</p>
              </div>
              <button className="self-start sm:self-auto bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </button>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <ClipboardDocumentListIcon className="w-7 h-7 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            </div>

            {/* Task Groups */}
            <div className="space-y-6">
              {taskGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleTaskGroup(groupIndex)}
                    className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
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
                      <span className="font-semibold text-gray-900">
                        {group.status}
                      </span>
                      <span className="text-sm text-gray-500">
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
                          className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-4">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() =>
                                toggleTaskCompletion(groupIndex, taskIndex)
                              }
                              className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium mb-2 ${
                                  task.completed
                                    ? 'line-through text-gray-400'
                                    : 'text-gray-900'
                                }`}
                              >
                                {task.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getColorClass(
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
                                <span className="text-sm text-gray-500 flex items-center">
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  {task.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Task Button */}
                      <button className="w-full px-6 py-4 text-left text-purple-600 hover:bg-purple-50 transition-colors font-medium">
                        {group.action}
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {
            setIsMobileSidebarOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default DashboardModule;
