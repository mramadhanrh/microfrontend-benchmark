import type { NavItem, Project } from '../../../dashboard-module';
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

interface SidebarProps {
  navItems: NavItem[];
  projects: Project[];
  activeNav: string;
  isExpanded: boolean;
  isMobileOpen: boolean;
  onNavSelect: (navId: string) => void;
  onExpandedChange: (expanded: boolean) => void;
  getColorClass: (color: string, type?: 'bg' | 'text') => string;
}

const Sidebar = ({
  navItems,
  projects,
  activeNav,
  isExpanded,
  isMobileOpen,
  onNavSelect,
  onExpandedChange,
  getColorClass,
}: SidebarProps) => {
  const iconClass = 'w-6 h-6';
  const icons: Record<string, typeof HomeIcon> = {
    house: HomeIcon,
    pushpin: MapPinIcon,
    clipboard: ClipboardDocumentListIcon,
    envelope: InboxIcon,
    calendar: CalendarIcon,
    chart: ChartBarIcon,
    gear: Cog6ToothIcon,
    star: StarIcon,
    hourglass: ClockIcon,
  };

  const solidIcons: Record<string, typeof HomeIconSolid> = {
    house: HomeIconSolid,
    pushpin: MapPinIconSolid,
    clipboard: ClipboardIconSolid,
    envelope: InboxIconSolid,
    calendar: CalendarIconSolid,
    chart: ChartIconSolid,
  };

  const renderIcon = (iconName: string, isSolid = false) => {
    const IconComponent = isSolid
      ? solidIcons[iconName] ?? HomeIconSolid
      : icons[iconName] ?? HomeIcon;

    return <IconComponent className={iconClass} />;
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-[#0F0F0F] border-r border-[#2D2D2D] flex flex-col overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isExpanded ? 'w-64' : 'w-20'}
      `}
      onMouseEnter={() => onExpandedChange(true)}
      onMouseLeave={() => onExpandedChange(false)}
    >
      <div className="py-5 px-4 border-b border-[#2D2D2D] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#E8232C] to-[#A01A20] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-lg">CH</span>
          </div>
          <div
            className={`transition-all duration-300 ${
              isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
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

      <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavSelect(item.id)}
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
                  {renderIcon(item.icon, activeNav === item.id)}
                  {item.badge && !isExpanded && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E8232C] text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  }`}
                >
                  {item.label || item.id}
                </span>
              </div>
              <span
                className={`bg-[#E8232C] text-white text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 flex-shrink-0 ${
                  item.badge && isExpanded
                    ? 'opacity-100 w-auto'
                    : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {item.badge}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 px-2">
          <div
            className={`flex items-center justify-between px-3 mb-2 transition-all duration-300 ${
              isExpanded ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
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
              isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'
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
                    isExpanded ? 'w-3 h-3 text-[0px]' : 'w-10 h-10 text-sm'
                  } ${getColorClass(project.color)} text-white`}
                >
                  {!isExpanded && project.id}
                </div>
                <span
                  className={`text-[#B3B3B3] font-medium whitespace-nowrap transition-all duration-300 group-hover:text-white ${
                    isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  }`}
                >
                  {project.name}
                </span>
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-3 py-2.5 group">
              <div
                className={`flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[#E8232C] ${
                  isExpanded ? 'w-0 h-0 opacity-0' : 'w-10 h-10 opacity-100'
                } border-2 border-dashed border-[#404040] text-[#858585] group-hover:text-[#E8232C]`}
              >
                {!isExpanded && <PlusIcon className="w-5 h-5" />}
              </div>
              <span
                className={`text-[#E8232C] hover:text-[#C41E26] text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                + Add Project
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="py-4 px-2 border-t border-[#2D2D2D] flex-shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[#B3B3B3] hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 group">
          <Cog6ToothIcon className="w-6 h-6 flex-shrink-0 transition-transform duration-200 group-hover:rotate-90" />
          <span
            className={`font-medium whitespace-nowrap transition-all duration-300 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}
          >
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
