import type { DecisionLogEntry } from "@/lib/api";

describe("DecisionLogEntry shape", () => {
  it("matches expected audit log fields", () => {
    const entry: DecisionLogEntry = {
      timestamp: "10:01",
      agent: "Intake Agent",
      action: "Received claim",
      claim_id: "abc-123",
      details: "Policy POL-12345",
    };

    expect(entry.agent).toBe("Intake Agent");
    expect(entry.action).toBe("Received claim");
  });
});
