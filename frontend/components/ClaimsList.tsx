import type { Claim } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  approved: "bg-blue-100 text-blue-800",
  denied: "bg-red-100 text-red-800",
  pending: "bg-zinc-100 text-zinc-800",
};

interface ClaimsListProps {
  claims: Claim[];
}

export function ClaimsList({ claims }: ClaimsListProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">
        Recent Claims
      </h2>

      {claims.length === 0 ? (
        <p className="text-sm text-zinc-500">No claims yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {claims.map((claim) => (
            <li key={claim.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {claim.claimant_name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {claim.policy_number} · ${claim.amount.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[claim.status] ?? "bg-zinc-100 text-zinc-800"}`}
                >
                  {claim.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
