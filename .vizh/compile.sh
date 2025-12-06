#!/bin/sh
#
# Compiles your code. This script is run before each test.
#
# For fast execution, uses pre-baked node_modules when available.
#

set -e

cd "$(dirname "$0")/.."

# Use pre-baked node_modules if available (for speed in test environment)
if [ -d "/opt/challenge-template/node_modules" ] && [ ! -d "node_modules" ]; then
    echo "Using pre-baked dependencies..."
    cp -r /opt/challenge-template/node_modules ./node_modules
fi

# Install any new/missing dependencies (fast if node_modules exists)
npm install --prefer-offline --no-audit --no-fund --progress=false --loglevel=error 2>/dev/null || true

# Compile TypeScript to JavaScript
npm run build
