import PageHeader from '@/components/layout/PageHeader';
import FirewallStats from '@/components/firewall/FirewallStats';
import FirewallTable from '@/components/firewall/FirewallTable';

export default function FirewallPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Firewall Logs" breadcrumb="NovaCover Internal System › Firewall" />

      <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Metric summary boxes */}
        <FirewallStats />

        {/* Dynamic logs filtering grid */}
        <FirewallTable />
      </div>
    </div>
  );
}