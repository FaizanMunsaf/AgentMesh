"""Start all 4 Band-connected agents as separate subprocesses."""

import subprocess
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]

AGENTS = [
    ("firewall", "agents.firewall.band_runner"),
    ("intake", "agents.intake.band_runner"),
    ("assessment", "agents.assessment.band_runner"),
    ("payout", "agents.payout.band_runner"),
]


def main() -> None:
    processes: list[tuple[str, subprocess.Popen]] = []

    for name, module in AGENTS:
        print(f"Starting {name} agent...")
        proc = subprocess.Popen(
            [sys.executable, "-m", module],
            cwd=BACKEND_ROOT,
        )
        processes.append((name, proc))

    print("\nAll agents started. Press Ctrl+C to stop.\n")
    try:
        for _name, proc in processes:
            proc.wait()
    except KeyboardInterrupt:
        print("\nStopping agents...")
        for name, proc in processes:
            proc.terminate()
            print(f"  stopped {name}")


if __name__ == "__main__":
    main()
