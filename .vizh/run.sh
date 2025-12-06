#!/bin/sh
#
# Runs your program. Tests call this script to execute your code.
#
# For TypeScript: Runs the compiled JavaScript from dist/
#
# Note: This file is used by Vizh.ai to run your program.
# Make sure compile.sh has been run first.
#

set -e

cd "$(dirname "$0")/.."

exec node dist/index.js "$@"

