import { ViewType, FilterType } from '../../types/inbox.type';
import Button from '../atoms/button';
import Dropdown from '../atoms/dropdown';
import Badge from '../atoms/badge';
import KebabMenu from '../atoms/kebab-menu';
import {
  ArchiveBoxIcon,
  InboxIcon,
  TagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface InboxHeaderProps {
  activeView: ViewType;
  activeFilter: FilterType;
  inboxCount: number;
  onViewChange: (view: ViewType) => void;
  onFilterChange: (filter: FilterType) => void;
  onAddLead: () => void;
}

const InboxHeader = ({
  activeView,
  activeFilter,
  inboxCount,
  onViewChange,
  onFilterChange,
  onAddLead,
}: InboxHeaderProps) => {
  const labelOptions = [
    { label: 'All labels', value: 'all' },
    { label: 'Warm', value: 'warm' },
    { label: 'Cold', value: 'cold' },
    { label: 'Active', value: 'active' },
    { label: 'Push', value: 'push' },
  ];

  const ownerOptions = [
    { label: 'Everyone', value: 'all' },
    { label: 'Kristin Watson', value: 'kristin' },
    { label: 'Albert Flores', value: 'albert' },
    { label: 'Jane Cooper', value: 'jane' },
    { label: 'Robert Fox', value: 'robert' },
    { label: 'Esther Howard', value: 'esther' },
    { label: 'Courtney Henry', value: 'courtney' },
    { label: 'Wade Warren', value: 'wade' },
    { label: 'Jenny Wilson', value: 'jenny' },
  ];

  const moreOptions = [
    {
      label: 'Settings',
      value: 'settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
    {
      label: 'Export',
      value: 'export',
      icon: <ArrowDownTrayIcon className="w-5 h-5" />,
    },
    {
      label: 'Filter',
      value: 'filter',
      icon: <FunnelIcon className="w-5 h-5" />,
    },
  ];

  const handleLabelSelect = (value: string) => {
    console.log('Selected label:', value);
    onFilterChange(value as FilterType);
  };

  const handleOwnerSelect = (value: string) => {
    console.log('Selected owner:', value);
  };

  const handleMoreAction = (value: string) => {
    console.log('More action:', value);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white animate-in fade-in slide-in-from-top-2 duration-300">
        Leads Inbox
      </h1>

      {/* Actions Row */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Left Section: Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewChange('inbox')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 ${
              activeView === 'inbox'
                ? 'bg-[#2D2D2D] text-white shadow-lg'
                : 'text-[#858585] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <InboxIcon className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
            <span>Inbox</span>
            {activeView === 'inbox' && inboxCount > 0 && (
              <Badge text={inboxCount.toString()} color="orange" size="sm" />
            )}
          </button>

          <button
            onClick={() => onViewChange('archive')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 ${
              activeView === 'archive'
                ? 'bg-[#2D2D2D] text-white shadow-lg'
                : 'text-[#858585] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <ArchiveBoxIcon className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
            <span>Archive</span>
          </button>
        </div>

        {/* Right Section: Filters and Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          <Dropdown
            label="All labels"
            icon={<TagIcon className="w-5 h-5" />}
            options={labelOptions}
            onSelect={handleLabelSelect}
          />

          <Dropdown
            label="Everyone"
            icon={<UserGroupIcon className="w-5 h-5" />}
            options={ownerOptions}
            onSelect={handleOwnerSelect}
          />

          <Button
            label="Add Lead"
            variant="primary"
            icon="plus"
            onClick={onAddLead}
            className="hidden sm:inline-flex transform hover:scale-105 active:scale-95 transition-transform duration-200"
          />

          <KebabMenu options={moreOptions} onSelect={handleMoreAction} />
        </div>
      </div>

      {/* Mobile Add Lead Button */}
      <div className="sm:hidden">
        <Button
          label="Add Lead"
          variant="primary"
          icon="plus"
          onClick={onAddLead}
          className="w-full transform active:scale-95 transition-transform duration-200"
        />
      </div>
    </div>
  );
};

export default InboxHeader;
