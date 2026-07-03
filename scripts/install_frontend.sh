#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../apps/frontend"

echo "Installing frontend dependencies..."
npm install
