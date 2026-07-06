# ArticleDesk

Monorepo pour le TP **Application Desktop Electron** — gestion d'articles avec authentification.

| Composant | Chemin | Stack |
|---|---|---|
| **API** | `apps/backend` | Node.js, Express, JWT |
| **Desktop** | `apps/frontend` | Electron, Vue 3, Tailwind, Vite |

## Prérequis

- Node.js ≥ 22 (CI GitHub Actions : 24)
- npm ≥ 10

## Démarrage rapide

```bash
git clone https://github.com/adamsbarry18/articledesk.git
cd articledesk

# Installation
./scripts/setup.sh
# ou : make install

# Terminal 1 — API (http://localhost:3000, Swagger : /api-docs)
make backend

# Terminal 2 — Application desktop
make frontend

# Vérifier la connectivité API
make check-api
```

## Configuration

Copiez `apps/frontend/.env.example` vers `apps/frontend/.env` :

```env
API_BASE_URL=http://localhost:3000
```

## Build exécutable

```bash
make build
# → apps/frontend/out/
# macOS : apps/frontend/out/ArticleDesk-darwin-arm64/ArticleDesk.app
```

L'API doit tourner en local (`make backend`) avant d'utiliser l'app packagée.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    apps/frontend                         │
│  ┌──────────┐    IPC     ┌──────────┐    HTTP          │
│  │ Vue 3    │ ◄────────► │ Electron │ ──────────────┐   │
│  │ Renderer │            │  Main    │               │   │
│  └──────────┘            └──────────┘               │   │
└──────────────────────────────────────────────────────│───┘
                                                       ▼
┌─────────────────────────────────────────────────────────┐
│                    apps/backend                          │
│              Express API (port 3000)                     │
└─────────────────────────────────────────────────────────┘
```

- Le renderer Vue ne contacte jamais l'API directement.
- Les appels passent par IPC (`preload.js` → `main.js` → `apiClient`).
- Sécurité Electron : `contextIsolation: true`, `nodeIntegration: false`, pont via `contextBridge`.

## Structure

```
articledesk/
├── .github/workflows/     # CI + Release
├── apps/
│   ├── backend/           # API REST (données en mémoire)
│   └── frontend/          # App Electron/Vue
├── scripts/               # Scripts d'installation
└── Makefile
```

Chaque application gère ses propres dépendances (`package.json` + `package-lock.json`).

## Comptes de test

| Email | Mot de passe |
|---|---|
| isaac@gmail.com | password |
| tata@gmail.com | 123456 |
| toto@gmail.com | 12345 |

## Licence

MIT
