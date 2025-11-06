import type { Task, TaskGroup } from '../dashboard-module';
import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

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
  <div className="bg-[#2D2D2D] rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-[#404040] rounded-lg">
        <ClipboardDocumentListIcon className="w-6 h-6 text-[#E8232C]" />
      </div>
      <h2 className="text-2xl font-bold text-white">My Tasks</h2>
    </div>

    <div className="space-y-4">
      {taskGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="border border-[#404040] rounded-xl overflow-hidden hover:border-[#5C5C5C] transition-all duration-200 hover:shadow-sm"
        >
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="font-semibold text-white text-sm uppercase tracking-wide">
                {group.status}
              </span>
              <span className="text-sm text-[#B3B3B3] font-medium">
                {group.count}
              </span>
            </div>
          </button>

          {group.expanded && (
            <div className="divide-y divide-[#404040]">
              {group.tasks.map((task: Task, taskIndex: number) => (
                <div
                  key={taskIndex}
                  className="px-6 py-4 hover:bg-[#1A1A1A] transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        onToggleTaskCompletion(groupIndex, taskIndex)
                      }
                      className="mt-1 w-5 h-5 rounded border-[#858585] text-[#E8232C] focus:ring-[#E8232C] focus:ring-offset-2 cursor-pointer transition-all duration-200 hover:scale-110 bg-transparent checked:bg-[#E8232C] checked:border-[#E8232C]"
                    />
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
                        <span className="text-sm text-[#B3B3B3] flex items-center gap-1 transition-colors duration-200 group-hover:text-[#858585]">
                          <CalendarIcon className="w-4 h-4" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
      ))}
    </div>
  </div>
);

export default TaskSection;
