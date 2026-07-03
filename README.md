# ArticleDesk

Monorepo pour le TP **Application Desktop Electron** — gestion d'articles avec authentification.

| Composant | Chemin | Stack |
|---|---|---|
| **API** | `apps/backend` | Node.js, Express, JWT |
| **Desktop** | `apps/frontend` | Electron, Vue 3, Tailwind, Vite |

## Démarrage rapide

```bash
# Installation
./scripts/setup.sh
# ou : make install

# Terminal 1 — API
make backend

# Terminal 2 — Application desktop
make frontend

# Vérifier l'API
make check-api
```

## Docker

```bash
# API seule (dev avec hot-reload via override)
docker compose up --build

# Production
docker compose -f docker-compose.yml up -d --build
```

## Build exécutable

```bash
make build
# → apps/frontend/out/
```

## Structure

```
articledesk/
├── .github/workflows/     # CI + Release
├── apps/
│   ├── backend/           # API REST (ApiArticle)
│   └── frontend/          # App Electron/Vue
├── docs/                  # Documentation
├── etc/nginx/             # Config proxy (optionnel)
├── scripts/               # Scripts d'installation
├── docker-compose.yml
├── docker-compose.override.yml
└── Makefile                # Pas de package.json racine — chaque app est autonome
```

Chaque application gère ses propres dépendances :

```
apps/backend/package.json + package-lock.json
apps/frontend/package.json + package-lock.json
```

## Documentation

- [Guide de démarrage](docs/getting-started.md)
- [Architecture](docs/architecture.md)

## Comptes de test

| Email | Mot de passe |
|---|---|
| isaac@gmail.com | password |
| tata@gmail.com | 123456 |
| toto@gmail.com | 12345 |

## Licence

MIT
