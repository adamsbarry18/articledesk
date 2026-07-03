# Architecture — ArticleDesk

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    apps/frontend                         │
│  ┌──────────┐    IPC     ┌──────────┐    HTTP          │
│  │ Vue 3    │ ◄────────► │ Electron │ ──────────────┐   │
│  │ Renderer │            │  Main    │               │   │
│  └──────────┘            └──────────┘               │   │
└──────────────────────────────────────────────────────│───┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────┐
│                    apps/backend                          │
│              Express API (port 3000)                     │
│   /login  /signup  /articles  /articles/:id  …          │
└─────────────────────────────────────────────────────────┘
```

## Monorepo

| Dossier | Rôle |
|---|---|
| `apps/backend` | API REST mockée (données en mémoire) — `npm install` local |
| `apps/frontend` | Application desktop Electron + Vue 3 — `npm install` local |
| `.github/workflows` | CI (tests API + build Vite) et releases |
| `etc/nginx` | Reverse proxy optionnel devant l'API |
| `scripts` | Automatisation installation |

## Communication

- Le **renderer Vue** ne contacte jamais l'API directement.
- Les appels passent par **IPC** (`preload.js` → `main.js` → `apiClient`).
- Le main process exécute les requêtes HTTP vers `API_BASE_URL`.

## Format de réponse API

```json
{
  "code": "200",
  "message": "Message lisible",
  "data": { }
}
```

## Sécurité Electron

- `contextIsolation: true`
- `nodeIntegration: false`
- Pont IPC via `contextBridge`
