"""Start all 4 Band-connected agents as separate subprocesses."""

import subprocess
import sys
import time
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]

AGENTS = [
    ("intake", "agents.intake.band_runner"),
    ("firewall", "agents.firewall.band_runner"),
    ("assessment", "agents.assessment.band_runner"),
    ("payout", "agents.payout.band_runner"),
]


def main() -> None:
    processes: list[tuple[str, subprocess.Popen]] = []

    for name, module in AGENTS:
        print(f"Starting {name} agent...")
        proc = subprocess.Popen([sys.executable, "-m", module], cwd=BACKEND_ROOT)
        processes.append((name, proc))

    print("\nAll agents started. Press Ctrl+C to stop.\n")

    try:
        # Monitor child processes; if any exits, report its code and stop others
        while True:
            for name, proc in processes:
                ret = proc.poll()
                if ret is not None:
                    print(f"Process {name} exited with code {ret}")
                    if ret != 0:
                        print(f"  (Non-zero exit for {name} — check its logs or env vars)")
                    # Terminate remaining processes
                    for n, p in processes:
                        if p is not proc and p.poll() is None:
                            try:
                                p.terminate()
                                print(f"  stopped {n}")
                            except Exception:
                                pass
                    return
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\nStopping agents...")
        for name, proc in processes:
            try:
                proc.terminate()
                print(f"  stopped {name}")
            except Exception:
                pass


if __name__ == "__main__":
    main()
