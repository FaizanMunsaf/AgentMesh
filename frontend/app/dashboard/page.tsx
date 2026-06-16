import PageHeader from '@/components/layout/PageHeader';
import KpiCards from '@/components/dashboard/KpiCards';
import ClaimsTable from '@/components/dashboard/ClaimsTable';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import AuthorityLimits from '@/components/dashboard/AuthorityLimits';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Dashboard" breadcrumb="NovaCover Internal System" />

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* KPIs Section */}
        <KpiCards />

        {/* Main Workspace Layout Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1 }}>
          
          {/* Main Table Column */}
          <ClaimsTable />

          {/* Right-Side Utility Feed Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ActivityFeed />
            <AuthorityLimits />
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}