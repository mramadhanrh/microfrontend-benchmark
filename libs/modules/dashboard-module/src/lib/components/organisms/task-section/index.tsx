import type { TaskGroup } from '../../../dashboard-module';
import SectionCard from '../../atoms/section-card';
import IconBadge from '../../atoms/icon-badge';
import TaskGroupPanel from '../../molecules/task-group-panel';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TaskSection = () => {
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
      action: 'Add task',
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
      action: 'Add task',
    },
  ]);

  const getColorClass = (color: string, type: 'bg' | 'text' = 'bg') => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      purple: { bg: 'bg-[#7B1FA2]', text: 'text-[#7B1FA2]' },
      blue: { bg: 'bg-[#1E88E5]', text: 'text-[#1E88E5]' },
      cyan: { bg: 'bg-[#00897B]', text: 'text-[#00897B]' },
      red: { bg: 'bg-[#E8232C]', text: 'text-[#E8232C]' },
      orange: { bg: 'bg-[#FB8C00]', text: 'text-[#FB8C00]' },
      gray: { bg: 'bg-[#858585]', text: 'text-[#858585]' },
    };
    return colorMap[color]?.[type] || colorMap.purple[type];
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      High: 'red',
      Normal: 'orange',
      Low: 'gray',
    };
    return priorityMap[priority] || 'gray';
  };

  const toggleTaskGroup = (groupIndex: number) => {
    setTaskGroups((groups) =>
      groups.map((group, idx) =>
        idx === groupIndex ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const toggleTaskCompletion = (groupIndex: number, taskIndex: number) => {
    setTaskGroups((groups) =>
      groups.map((group, gIdx) =>
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
            onToggleGroup={toggleTaskGroup}
            onToggleTaskCompletion={toggleTaskCompletion}
            getColorClass={getColorClass}
            getPriorityColor={getPriorityColor}
          />
        ))}
      </div>
    </SectionCard>
  );
};

export default TaskSection;
