#!/bin/sh
#
# Use this script to run your program LOCALLY.
#
# This is a convenience wrapper that compiles and runs your code.
# Vizh.ai uses .vizh/compile.sh and .vizh/run.sh instead.
#

set -e

cd "$(dirname "$0")"

# Compile first
./.vizh/compile.sh

# Run with any arguments passed
./.vizh/run.sh "$@"
