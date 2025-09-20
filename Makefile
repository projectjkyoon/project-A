.PHONY: dev web api db seed lint test build typecheck

dev:
docker compose up --build

web:
cd apps/web && npm run dev

api:
cd apps/api && npm run dev

lint:
npm run lint

test:
npm run test

typecheck:
npm run typecheck

build:
npm run build

seed:
npm run db:seed
