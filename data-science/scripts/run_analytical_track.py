import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TRACK_DIR = ROOT / "data-science" / "scripts" / "track-specific"

if str(TRACK_DIR) not in sys.path:
    sys.path.insert(0, str(TRACK_DIR))

from comparative_intelligence import run

if __name__ == "__main__":
    run()
