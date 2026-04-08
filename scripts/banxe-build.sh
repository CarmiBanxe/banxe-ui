#!/usr/bin/env bash
# banxe-build.sh — BANXE UI Pipeline (run from banxe-ui root)
# See full version: ~/banxe-architecture/scripts/banxe-build.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$HOME/banxe-architecture/scripts/banxe-build.sh" "$@"
