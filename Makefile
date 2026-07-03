.PHONY: help install install-backend install-frontend dev backend frontend check-api build docker-up docker-down clean

help: ## Affiche l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances backend + frontend
	@echo "📦 Installation backend..."
	./scripts/install_backend.sh
	@echo "📦 Installation frontend..."
	./scripts/install_frontend.sh
	@echo "✅ Backend et frontend installés"

install-backend: ## Installe les dépendances du backend
	./scripts/install_backend.sh

install-frontend: ## Installe les dépendances du frontend
	./scripts/install_frontend.sh

dev: ## Indique comment démarrer backend + frontend (2 terminaux)
	@echo "Lancez dans deux terminaux :"
	@echo "  make backend"
	@echo "  make frontend"

backend: ## Démarre l'API backend (port 3000)
	cd apps/backend && npm run dev

frontend: ## Démarre l'application desktop Electron
	cd apps/frontend && npm start

check-api: ## Vérifie la connectivité ApiArticle
	cd apps/frontend && npm run check:api

build: ## Génère l'exécutable desktop (OS courant)
	cd apps/frontend && npm run make

docker-up: ## Démarre les services Docker (API)
	docker compose up -d --build

docker-down: ## Arrête les services Docker
	docker compose down

clean: ## Supprime node_modules et artefacts de build
	rm -rf apps/backend/node_modules apps/frontend/node_modules
	rm -rf apps/frontend/out apps/frontend/dist apps/frontend/.vite
