import type { Task } from '../../dashboard-module';
import TaskCheckbox from '../atoms/task-checkbox';
import PriorityTag from '../atoms/priority-tag';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface TaskRowProps {
  task: Task;
  onToggle: () => void;
  getColorClass: (color: string, type?: 'bg' | 'text') => string;
  getPriorityColor: (priority: string) => string;
}

const TaskRow = ({ task, onToggle, getColorClass, getPriorityColor }: TaskRowProps) => (
  <div className="px-6 py-4 hover:bg-[#1A1A1A] transition-all duration-200 group">
    <div className="flex items-start space-x-4">
      <TaskCheckbox checked={task.completed} onChange={onToggle} />
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium mb-2 transition-all duration-300 ${
            task.completed
              ? 'line-through text-[#5C5C5C]'
              : 'text-white group-hover:text-[#E8232C]'
          }`}
        >
          {task.name}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <PriorityTag
            label={task.priority}
            textClass={getColorClass(getPriorityColor(task.priority), 'text')}
            tone={getPriorityColor(task.priority)}
          />
          <span className="text-sm text-[#B3B3B3] flex items-center gap-1 transition-colors duration-200 group-hover:text-[#858585]">
            <CalendarIcon className="w-4 h-4" />
            {task.dueDate}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default TaskRow;
