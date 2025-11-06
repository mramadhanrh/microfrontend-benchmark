import { Lead } from '../../types/inbox.type';
import Avatar from '../atoms/avatar';
import Badge from '../atoms/badge';
import KebabMenu from '../atoms/kebab-menu';
import {
  CursorArrowRaysIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface LeadRowProps {
  lead: Lead;
  onToggleSelect: (id: string) => void;
}

const LeadRow = ({ lead, onToggleSelect }: LeadRowProps) => {
  const getActivityColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'text-[#E8232C]',
      gray: 'text-[#858585]',
      green: 'text-[#00897B]',
    };
    return colorMap[color] || colorMap.gray;
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

  const handleKebabAction = (action: string) => {
    console.log(`Action ${action} on lead ${lead.id}`);
    // Handle actions here
  };

  return (
    <tr className="group border-b border-[#2D2D2D] hover:bg-[#1A1A1A] transition-all duration-200 ease-out">
      {/* Checkbox - Hidden on mobile */}
      <td className="px-4 py-4 hidden md:table-cell">
        <input
          type="checkbox"
          checked={lead.selected || false}
          onChange={() => onToggleSelect(lead.id)}
          className="w-4 h-4 rounded border-2 border-[#858585] bg-transparent checked:bg-[#E8232C] checked:border-[#E8232C] cursor-pointer transition-all duration-200 hover:border-[#B3B3B3] focus:ring-2 focus:ring-[#E8232C] focus:ring-opacity-20 focus:ring-offset-0"
        />
      </td>

      {/* Title */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={lead.selected || false}
            onChange={() => onToggleSelect(lead.id)}
            className="w-4 h-4 rounded border-2 border-[#858585] bg-transparent checked:bg-[#E8232C] checked:border-[#E8232C] cursor-pointer transition-all duration-200 hover:border-[#B3B3B3] focus:ring-2 focus:ring-[#E8232C] focus:ring-opacity-20 focus:ring-offset-0 md:hidden"
          />
          <span className="text-white font-medium group-hover:text-[#E8232C] transition-colors duration-200">
            {lead.title}
          </span>
        </div>
      </td>

      {/* Owner - Hidden on mobile */}
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-3">
          <Avatar name={lead.owner.name} avatar={lead.owner.avatar} size="sm" />
          <span className="text-[#B3B3B3] group-hover:text-white transition-colors duration-200">
            {lead.owner.name}
          </span>
        </div>
      </td>

      {/* Labels */}
      <td className="px-4 py-4 hidden sm:table-cell">
        <Badge text={lead.labels.text} color={lead.labels.color} size="sm" />
      </td>

      {/* Source - Hidden on mobile and tablet */}
      <td className="px-4 py-4 hidden xl:table-cell">
        <div className="flex items-center gap-2 text-[#B3B3B3] group-hover:text-white transition-colors duration-200">
          {sourceIcons[lead.source.icon]}
          <span>{lead.source.text}</span>
        </div>
      </td>

      {/* Lead Created - Hidden on mobile */}
      <td className="px-4 py-4 hidden md:table-cell">
        <span className="text-[#B3B3B3] text-sm group-hover:text-white transition-colors duration-200">
          {lead.leadCreated}
        </span>
      </td>

      {/* Next Activity */}
      <td className="px-4 py-4">
        <span
          className={`text-sm font-medium transition-all duration-200 ${getActivityColorClass(
            lead.nextActivity.color
          )}`}
        >
          {lead.nextActivity.text}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <KebabMenu options={kebabOptions} onSelect={handleKebabAction} />
      </td>
    </tr>
  );
};

export default LeadRow;
