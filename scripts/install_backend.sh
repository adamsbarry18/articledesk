#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../apps/backend"

echo "Installing backend dependencies..."
npm install
