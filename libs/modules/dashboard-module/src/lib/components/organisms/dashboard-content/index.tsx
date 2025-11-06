import { TabContentType } from '../../../types/tabs.type';
import TaskSection from '../task-section';
import InboxSection from '../inbox-section';

interface DashboardContentProps {
  activeTab?: TabContentType;
}

const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  if (!activeTab) {
    return null;
  }

  return (
    <>
      {activeTab === TabContentType.Tasks && <TaskSection />}
      {activeTab === TabContentType.Inbox && <InboxSection />}
    </>
  );
};

export default DashboardContent;
