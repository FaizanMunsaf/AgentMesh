import PageHeader from '@/components/layout/PageHeader';
import ChatPanel from '@/components/claims/ChatPanel';
import AgentPipeline from '@/components/claims/AgentPipeline';

export default function ClaimsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Claims Chat" breadcrumb="NovaCover Internal System › Claims" />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left main interactive chat module */}
        <ChatPanel />

        {/* Right contextual tracking stream */}
        <AgentPipeline />
      </div>
    </div>
  );
}