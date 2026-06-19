import PageHeader from '@/components/layout/PageHeader';

export default function GuidelinesPage() {
  const hardcodedPolicies = [
    'NVC-10001 — holder: Jane Doe — coverages: collision, liability — active',
    'NVC-10002 — holder: John Smith — coverages: collision, medical, theft — active',
    'NVC-10003 — holder: Maria Garcia — coverages: collision, liability, medical — active',
    'NVC-10004 — holder: Bob Wilson — coverages: collision — INACTIVE',
    'NVC-10005 — holder: Alice Chen — coverages: theft, liability — active',
  ];
  const policyCount = hardcodedPolicies.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <PageHeader title="Guidelines" breadcrumb="NovaCover Internal System › Guidelines" />

      <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
        <div style={{ maxWidth: '900px' }}>
          <h2 className="animate-fade-up" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>How to use ClaimGuard AI</h2>
          <p className="animate-fade-up" style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px' }}>
            ClaimGuard AI is built as a band of specialised agents that automatically orchestrate to process claims. Submit a claim from the Claims Chat or call the intake agent programmatically; the system routes the request through the intake → assessment → firewall → payout agents until the claim lifecycle completes.
          </p>

          {/* Policy count card */}
          <div className="card-elevated animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', marginBottom: '18px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.06))', border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-blue)' }}>{policyCount}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Available policies</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>We currently have <strong style={{ color: 'var(--text-primary)' }}>{policyCount}</strong> mock policies loaded for demo and decisioning.</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Policies shown below as readable text — no JSON file view required.
            </div>
          </div>

          <h3 style={{ marginTop: '18px', fontSize: '15px', fontWeight: 600 }}>Orchestration flow</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li><strong>Intake agent:</strong> collects claim details and normalizes input (dates in ISO format YYYY-MM-DD, amounts as numbers in USD).</li>
            <li><strong>Assessment agent:</strong> validates coverage, matches policy clauses, and prepares decision rationale.</li>
            <li><strong>Firewall agent:</strong> performs clearance and policy enforcement checks.</li>
            <li><strong>Payout agent:</strong> applies authority limits and finalizes approvals and payments.</li>
          </ul>

          <h3 style={{ marginTop: '18px', fontSize: '15px', fontWeight: 600 }}>Agent connections</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Agents connect via band agent cards visible in the UI (see the Agent Pipeline on the right of the Claims Chat). Each card displays live status, messages, and timestamps during orchestration.
          </p>

          <h3 style={{ marginTop: '18px', fontSize: '15px', fontWeight: 600 }}>Policies used by the bot</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
            The demo uses mock policies to drive decision-making. Below are the loaded mock policies rendered for easy reading.
          </p>

          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', lineHeight: 1.8 }}>
              <li>NVC-10001 — holder: Jane Doe — coverages: collision, liability — active</li>
              <li>NVC-10002 — holder: John Smith — coverages: collision, medical, theft — active</li>
              <li>NVC-10003 — holder: Maria Garcia — coverages: collision, liability, medical — active</li>
              <li>NVC-10004 — holder: Bob Wilson — coverages: collision — INACTIVE</li>
              <li>NVC-10005 — holder: Alice Chen — coverages: theft, liability — active</li>
            </ul>
          </div>

          <h3 className="animate-fade-up" style={{ marginTop: '18px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue-glow)' }} /> Examples
          </h3>

          <div style={{ marginTop: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>Full demo conversation</div>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'var(--text-primary)' }}>{`@Hackthon Intake new claim: John Smith, Policy NVC-10002, collision, I was rear-ended on 2026-06-16 at a parking lot by another vehicle causing front bumper damage, amount $500

@Hackthon Intake: Policy NVC-10002 is active and held by John Smith with collision coverage. Missing info: incident date in ISO format and claim amount as a number.

@Hackthon Intake: 2026-06-16, $500

@Hackthon Intake: Thank you — validating claim for John Smith. Proceeding with validation...

@Hackthon-Assessment -> Hackthon-firewall: clearance_request {...}

@Hackthon-Assessment -> Hackthon-payout: approved_claim {...}

@Hackthon-payout: ✅ Claim Approved & Payment Processed — Claimant: John Smith | Policy: NVC-10002 | Amount: $500`}</pre>
          </div>

          <div style={{ marginTop: '12px', display: 'grid', gap: '12px' }}>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600 }}>Quick intake example</div>
              <div style={{ color: 'var(--text-primary)', marginTop: '6px' }}>User: I was hit in the parking lot, rear bumper damage. Policy NVC-10005. Incident: 2026-05-10. Amount: 750</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Bot: Intake agent asks for any missing ISO date or numeric amount and then routes to Assessment.</div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600 }}>Policy question example</div>
              <div style={{ color: 'var(--text-primary)', marginTop: '6px' }}>User: Does my policy NVC-10002 cover collision if I was rear-ended?</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Bot: Assessment agent checks mock_policies.json and responds with coverage details and next steps.</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
