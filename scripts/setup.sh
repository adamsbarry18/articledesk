#!/usr/bin/env bash
# Installation initiale du monorepo ArticleDesk
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "📦 Installation ArticleDesk..."
make install

echo ""
echo "✅ Installation terminée."
echo ""
echo "Prochaines étapes :"
echo "  1. Terminal 1 : make backend"
echo "  2. Terminal 2 : make frontend"
echo "  3. make check-api"
echo ""
