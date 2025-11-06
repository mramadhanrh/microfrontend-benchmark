import { TabContentType } from '../../../types/tabs.type';
import TaskSection from '../task-section';
import InboxSection from '../inbox-section';
import ReportDashboardSection from '../report-dashboard-section';

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
      {activeTab === TabContentType.ReportDashboard && (
        <ReportDashboardSection />
      )}
    </>
  );
};

export default DashboardContent;
