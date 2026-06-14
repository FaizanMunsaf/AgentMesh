"use client";

import { useCallback, useEffect, useState } from "react";

import { ClaimForm } from "@/components/ClaimForm";
import { ClaimsList } from "@/components/ClaimsList";
import { DecisionLog } from "@/components/DecisionLog";
import {
  fetchClaims,
  fetchDecisionLog,
  type Claim,
  type DecisionLogEntry,
} from "@/lib/api";

export function Dashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [logEntries, setLogEntries] = useState<DecisionLogEntry[]>([]);

  const refresh = useCallback(async () => {
    const [claimsData, logData] = await Promise.all([
      fetchClaims(),
      fetchDecisionLog(),
    ]);
    setClaims(claimsData);
    setLogEntries(logData);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleSubmitted() {
    refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Agent Mesh
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          4-agent pipeline: Intake → Firewall → Assessment → Payout
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ClaimForm onSubmitted={handleSubmitted} />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <DecisionLog entries={logEntries} />
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <ClaimsList claims={claims} />
      </section>
    </div>
  );
}
