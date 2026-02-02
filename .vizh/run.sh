#!/bin/sh
#
# Runs your program using Bun.
#
set -e

cd "$(dirname "$0")/.."

export CI=true
export FORCE_COLOR=0
export NO_COLOR=1
export BUN_NO_CLEAR_SCREEN=1

# Execute directly with Bun
exec bun run src/index.ts "$@"
