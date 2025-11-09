import type { TaskGroup } from '../../dashboard-module';
import TaskRow from './task-row';
import { PlusIcon } from '@heroicons/react/24/outline';

interface TaskGroupPanelProps {
  group: TaskGroup;
  groupIndex: number;
  onToggleGroup: (groupIndex: number) => void;
  onToggleTaskCompletion: (groupIndex: number, taskIndex: number) => void;
  getColorClass: (color: string, type?: 'bg' | 'text') => string;
  getPriorityColor: (priority: string) => string;
}

const TaskGroupPanel = ({
  group,
  groupIndex,
  onToggleGroup,
  onToggleTaskCompletion,
  getColorClass,
  getPriorityColor,
}: TaskGroupPanelProps) => (
  <div className="border border-[#404040] rounded-xl overflow-hidden hover:border-[#5C5C5C] transition-all duration-200 hover:shadow-sm">
    <button
      onClick={() => onToggleGroup(groupIndex)}
      className="w-full bg-[#1A1A1A] px-6 py-4 flex items-center justify-between hover:bg-[#0F0F0F] transition-all duration-200 group"
    >
      <div className="flex items-center space-x-3">
        <svg
          className={`w-5 h-5 text-[#858585] transition-all duration-300 group-hover:text-[#B3B3B3] ${
            group.expanded ? 'rotate-90' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-white text-sm uppercase tracking-wide">
          {group.status}
        </span>
        <span className="text-sm text-[#B3B3B3] font-medium">{group.count}</span>
      </div>
    </button>

    {group.expanded && (
      <div className="divide-y divide-[#404040]">
        {group.tasks.map((task, taskIndex) => (
          <TaskRow
            key={`${group.status}-${taskIndex}`}
            task={task}
            onToggle={() => onToggleTaskCompletion(groupIndex, taskIndex)}
            getColorClass={getColorClass}
            getPriorityColor={getPriorityColor}
          />
        ))}

        <button className="w-full px-6 py-4 text-left text-[#E8232C] hover:bg-[#1A1A1A] transition-all duration-200 font-medium group hover:px-7">
          <span className="inline-flex items-center gap-2 leading-4">
            <PlusIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            {group.action}
          </span>
        </button>
      </div>
    )}
  </div>
);

export default TaskGroupPanel;
