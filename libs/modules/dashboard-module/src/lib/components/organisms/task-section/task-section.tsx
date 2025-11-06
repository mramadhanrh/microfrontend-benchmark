import type { TaskGroup } from '../../../dashboard-module';
import SectionCard from '../../atoms/section-card';
import IconBadge from '../../atoms/icon-badge';
import TaskGroupPanel from '../../molecules/task-group-panel';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface TaskSectionProps {
  taskGroups: TaskGroup[];
  onToggleGroup: (groupIndex: number) => void;
  onToggleTaskCompletion: (groupIndex: number, taskIndex: number) => void;
  getColorClass: (color: string, type?: 'bg' | 'text') => string;
  getPriorityColor: (priority: string) => string;
}

const TaskSection = ({
  taskGroups,
  onToggleGroup,
  onToggleTaskCompletion,
  getColorClass,
  getPriorityColor,
}: TaskSectionProps) => (
  <SectionCard>
    <div className="flex items-center space-x-3 mb-6">
      <IconBadge>
        <ClipboardDocumentListIcon className="w-6 h-6 text-[#E8232C]" />
      </IconBadge>
      <h2 className="text-2xl font-bold text-white">My Tasks</h2>
    </div>

    <div className="space-y-4">
      {taskGroups.map((group, groupIndex) => (
        <TaskGroupPanel
          key={`${group.status}-${groupIndex}`}
          group={group}
          groupIndex={groupIndex}
          onToggleGroup={onToggleGroup}
          onToggleTaskCompletion={onToggleTaskCompletion}
          getColorClass={getColorClass}
          getPriorityColor={getPriorityColor}
        />
      ))}
    </div>
  </SectionCard>
);

export default TaskSection;
