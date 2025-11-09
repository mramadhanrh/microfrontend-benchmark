import { useState } from 'react';
import { Lead, ViewType, FilterType } from '../../../types/inbox.type';
import SectionCard from '../../atoms/section-card';
import Badge from '../../atoms/badge';
import InboxHeader from '../../molecules/inbox-header';
import LeadRow from '../../molecules/lead-row';
import Avatar from '../../atoms/avatar';
import KebabMenu from '../../atoms/kebab-menu';
import {
  CursorArrowRaysIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const InboxSection = () => {
  const [activeView, setActiveView] = useState<ViewType>('inbox');
  const [activeFilter] = useState<FilterType>('all');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      title: 'olux Lead',
      owner: {
        name: 'Kristin Watson',
      },
      labels: {
        text: 'Warm',
        color: 'warm',
      },
      source: {
        icon: 'target',
        text: 'Manually',
      },
      leadCreated: 'Dec 27, 2023, 3:12',
      nextActivity: {
        text: 'No activity',
        color: 'red',
      },
      selected: false,
    },
    {
      id: '2',
      title: 'Initech',
      owner: {
        name: 'Albert Flores',
      },
      labels: {
        text: 'Cold',
        color: 'cold',
      },
      source: {
        icon: 'automatic',
        text: 'Automatic',
      },
      leadCreated: 'Dec 27, 2023, 3:12',
      nextActivity: {
        text: 'Close',
        color: 'gray',
      },
      selected: false,
    },
    {
      id: '3',
      title: 'Acme Corporation',
      owner: {
        name: 'Jane Cooper',
      },
      labels: {
        text: 'Active',
        color: 'active',
      },
      source: {
        icon: 'automatic',
        text: 'Automatic',
      },
      leadCreated: 'Dec 26, 2023, 14:22',
      nextActivity: {
        text: 'Follow up',
        color: 'green',
      },
      selected: false,
    },
    {
      id: '4',
      title: 'TechStart Inc',
      owner: {
        name: 'Robert Fox',
      },
      labels: {
        text: 'Warm',
        color: 'warm',
      },
      source: {
        icon: 'target',
        text: 'Manually',
      },
      leadCreated: 'Dec 25, 2023, 10:45',
      nextActivity: {
        text: 'No activity',
        color: 'red',
      },
      selected: false,
    },
    {
      id: '5',
      title: 'GlobalTech Solutions',
      owner: {
        name: 'Esther Howard',
      },
      labels: {
        text: 'Cold',
        color: 'cold',
      },
      source: {
        icon: 'automatic',
        text: 'Automatic',
      },
      leadCreated: 'Dec 24, 2023, 16:30',
      nextActivity: {
        text: 'Close',
        color: 'gray',
      },
      selected: false,
    },
    {
      id: '6',
      title: 'Digital Dynamics',
      owner: {
        name: 'Courtney Henry',
      },
      labels: {
        text: 'Active',
        color: 'active',
      },
      source: {
        icon: 'target',
        text: 'Manually',
      },
      leadCreated: 'Dec 23, 2023, 9:15',
      nextActivity: {
        text: 'Follow up',
        color: 'green',
      },
      selected: false,
    },
    {
      id: '7',
      title: 'Innovation Labs',
      owner: {
        name: 'Wade Warren',
      },
      labels: {
        text: 'Warm',
        color: 'warm',
      },
      source: {
        icon: 'automatic',
        text: 'Automatic',
      },
      leadCreated: 'Dec 22, 2023, 13:50',
      nextActivity: {
        text: 'No activity',
        color: 'red',
      },
      selected: false,
    },
    {
      id: '8',
      title: 'FutureVision Corp',
      owner: {
        name: 'Jenny Wilson',
      },
      labels: {
        text: 'Push',
        color: 'push',
      },
      source: {
        icon: 'target',
        text: 'Manually',
      },
      leadCreated: 'Dec 21, 2023, 11:20',
      nextActivity: {
        text: 'Close',
        color: 'gray',
      },
      selected: false,
    },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  const handleToggleSelect = (id: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, selected: !lead.selected } : lead
      )
    );
  };

  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setLeads((prevLeads) =>
      prevLeads.map((lead) => ({ ...lead, selected: newSelectAll }))
    );
  };

  const handleAddLead = () => {
    console.log('Add lead clicked');
  };

  const handleFilterChange = () => {
    // Filter change logic will be implemented here
  };

  const sourceIcons: Record<string, JSX.Element> = {
    target: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    automatic: <CursorArrowRaysIcon className="w-5 h-5" />,
  };

  const getActivityColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'text-[#E8232C]',
      gray: 'text-[#858585]',
      green: 'text-[#00897B]',
    };
    return colorMap[color] || colorMap.gray;
  };

  const kebabOptions = [
    {
      label: 'Edit',
      value: 'edit',
      icon: <PencilIcon className="w-5 h-5" />,
    },
    {
      label: 'Duplicate',
      value: 'duplicate',
      icon: <DocumentDuplicateIcon className="w-5 h-5" />,
    },
    {
      label: 'Archive',
      value: 'archive',
      icon: <ArchiveBoxIcon className="w-5 h-5" />,
    },
    {
      label: 'Delete',
      value: 'delete',
      icon: <TrashIcon className="w-5 h-5" />,
      variant: 'danger' as const,
    },
  ];

  const handleKebabAction = (leadId: string, action: string) => {
    console.log(`Action ${action} on lead ${leadId}`);
  };

  const inboxCount = leads.length;

  return (
    <SectionCard>
      <InboxHeader
        activeView={activeView}
        activeFilter={activeFilter}
        inboxCount={inboxCount}
        onViewChange={setActiveView}
        onFilterChange={handleFilterChange}
        onAddLead={handleAddLead}
      />

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto -mx-6 md:-mx-8">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b border-[#2D2D2D]">
                <tr>
                  {/* Checkbox Column - Hidden on mobile */}
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-2 border-[#858585] bg-transparent checked:bg-[#E8232C] checked:border-[#E8232C] cursor-pointer transition-all duration-200 hover:border-[#B3B3B3] focus:ring-2 focus:ring-[#E8232C] focus:ring-opacity-20 focus:ring-offset-0"
                    />
                  </th>

                  {/* Title */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider">
                    Title
                  </th>

                  {/* Owner - Hidden on mobile */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider hidden lg:table-cell">
                    Owner
                  </th>

                  {/* Labels - Hidden on mobile */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider hidden sm:table-cell">
                    Labels
                  </th>

                  {/* Source - Hidden on mobile and tablet */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider hidden xl:table-cell">
                    Source
                  </th>

                  {/* Lead Created - Hidden on mobile */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider hidden md:table-cell">
                    Lead Created
                  </th>

                  {/* Next Activity */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider">
                    Next Activity
                  </th>

                  {/* Actions */}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#B3B3B3] uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2D2D]">
                {leads.map((lead, index) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {leads.length === 0 && (
              <div className="text-center py-12 animate-in fade-in duration-300">
                <p className="text-[#858585] text-lg">No leads found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cards View - Shows all information consistently */}
      <div className="block sm:hidden space-y-3">
        {leads.map((lead, index) => (
          <div
            key={lead.id}
            className="bg-[#1A1A1A] rounded-lg p-4 border border-[#2D2D2D] hover:border-[#404040] transition-all duration-200 ease-out hover:shadow-lg animate-in fade-in slide-in-from-bottom-2"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={lead.selected || false}
                  onChange={() => handleToggleSelect(lead.id)}
                  className="w-4 h-4 rounded border-2 border-[#858585] bg-transparent checked:bg-[#E8232C] checked:border-[#E8232C] cursor-pointer transition-all duration-200 hover:border-[#B3B3B3] focus:ring-2 focus:ring-[#E8232C] focus:ring-opacity-20 focus:ring-offset-0 flex-shrink-0"
                />
                <h3 className="text-white font-medium">{lead.title}</h3>
              </div>
              <KebabMenu
                options={kebabOptions}
                onSelect={(action) => handleKebabAction(lead.id, action)}
              />
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#858585] w-24 flex-shrink-0">
                  Owner:
                </span>
                <div className="flex items-center gap-2">
                  <Avatar
                    name={lead.owner.name}
                    avatar={lead.owner.avatar}
                    size="sm"
                  />
                  <span className="text-[#B3B3B3]">{lead.owner.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#858585] w-24 flex-shrink-0">
                  Label:
                </span>
                <Badge
                  text={lead.labels.text}
                  color={lead.labels.color}
                  size="sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#858585] w-24 flex-shrink-0">
                  Source:
                </span>
                <div className="flex items-center gap-2 text-[#B3B3B3]">
                  {sourceIcons[lead.source.icon]}
                  <span>{lead.source.text}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#858585] w-24 flex-shrink-0">
                  Created:
                </span>
                <span className="text-[#B3B3B3]">{lead.leadCreated}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#858585] w-24 flex-shrink-0">
                  Next Activity:
                </span>
                <span
                  className={`font-medium ${getActivityColorClass(
                    lead.nextActivity.color
                  )}`}
                >
                  {lead.nextActivity.text}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {leads.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <p className="text-[#858585] text-lg">No leads found</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default InboxSection;
