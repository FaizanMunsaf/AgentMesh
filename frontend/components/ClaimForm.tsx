"use client";

import { useState } from "react";

import { submitClaim, type Claim, type ClaimCreate } from "@/lib/api";

interface ClaimFormProps {
  onSubmitted: (claim: Claim) => void;
}

export function ClaimForm({ onSubmitted }: ClaimFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const data: ClaimCreate = {
      claimant_name: form.get("claimant_name") as string,
      policy_number: form.get("policy_number") as string,
      amount: parseFloat(form.get("amount") as string),
      description: form.get("description") as string,
      ssn: (form.get("ssn") as string) || undefined,
    };

    try {
      const claim = await submitClaim(data);
      onSubmitted(claim);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900">Submit Claim</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600">Claimant Name</span>
          <input
            name="claimant_name"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2"
            placeholder="Jane Doe"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600">Policy Number</span>
          <input
            name="policy_number"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2"
            placeholder="POL-12345"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600">Amount ($)</span>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2"
            placeholder="5000.00"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-600">SSN (demo PII)</span>
          <input
            name="ssn"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2"
            placeholder="123-45-6789"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-zinc-600">Description</span>
        <textarea
          name="description"
          required
          rows={3}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2"
          placeholder="Describe the claim..."
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Submit Claim"}
      </button>
    </form>
  );
}
