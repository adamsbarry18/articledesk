# Guide de démarrage — ArticleDesk

## Prérequis

- Node.js ≥ 20
- npm ≥ 10
- Docker (optionnel, pour l'API containerisée)

## Installation locale

```bash
git clone https://github.com/adamsbarry18/articledesk.git
cd articledesk
make install          # ou : make install-backend && make install-frontend
```

## Mode développement (recommandé)

### 1. Démarrer l'API

```bash
make backend
# API disponible sur http://localhost:3000
# Swagger : http://localhost:3000/api-docs
```

### 2. Démarrer l'application desktop

```bash
make frontend
```

### 3. Valider la connectivité

```bash
make check-api
```

## Configuration

Copiez `.env.example` vers `.env` à la racine (Docker).

Pour le frontend, configurez `apps/frontend/.env` :

```env
API_BASE_URL=http://localhost:3000
```

## Docker

```bash
docker compose up --build
```

L'override de développement monte le code source et active `nodemon`.

## Build production desktop

```bash
make build
```

L'exécutable est généré dans `apps/frontend/out/`.
