import type { DecisionLogEntry } from "@/lib/api";

const AGENT_COLORS: Record<string, string> = {
  "Intake Agent": "bg-blue-100 text-blue-800",
  "Firewall Agent": "bg-amber-100 text-amber-800",
  "Assessment Agent": "bg-green-100 text-green-800",
  "Payout Agent": "bg-purple-100 text-purple-800",
};

const SOURCE_LABELS: Record<string, string> = {
  firewall: "Field-level",
  pipeline: "Agent step",
};

interface DecisionLogProps {
  entries: DecisionLogEntry[];
}

export function DecisionLog({ entries }: DecisionLogProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">
        Agent Decision Log
      </h2>
      <p className="mb-4 text-xs text-zinc-500">
        Pipeline steps and firewall field-level governance (block / transform /
        justify)
      </p>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Submit a claim to see the agent pipeline in action.
        </p>
      ) : (
        <ol className="relative border-l border-zinc-200 pl-6">
          {entries.map((entry, index) => (
            <li key={`${entry.timestamp}-${index}`} className="mb-6 ml-2">
              <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white" />
              <time className="mb-1 block text-xs font-mono text-zinc-500">
                {entry.timestamp}
              </time>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${AGENT_COLORS[entry.agent] ?? "bg-zinc-100 text-zinc-800"}`}
              >
                {entry.agent}
              </span>
              {entry.source && (
                <span className="ml-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                  {SOURCE_LABELS[entry.source] ?? entry.source}
                </span>
              )}
              <p className="mt-1 text-sm font-medium text-zinc-900">
                {entry.action}
              </p>
              {entry.details && (
                <p className="text-xs text-zinc-500">{entry.details}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
