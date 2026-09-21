# CreemY

A production-oriented ride-hailing platform monorepo with an Express/MongoDB API and a responsive React rider, driver, and operations surface.

## Architecture

- **API (`apps/api`)**: layered Express application with security middleware, typed validation, JWT access authentication, rotating/revocable refresh sessions, RBAC, ownership enforcement, centralized errors, health/readiness probes, Socket.IO authentication, and MongoDB data models.
- **Domain**: MongoDB is the durable system of record. `Ride` uses a guarded lifecycle; `Driver.location` and pickup locations use GeoJSON/`2dsphere` indexes. Dispatch queries only nearby approved, online, available drivers and atomically claims a matching ride.
- **Web (`apps/web`)**: Vite + React + TypeScript, TanStack Query, Zustand, Framer Motion, semantic mobile-first UI. It calls the API rather than using mock application data.
- **Scale-out boundary**: Redis is configured as infrastructure; add the Socket.IO Redis adapter and a queue worker when deploying multiple API replicas. Financial writes should be run in MongoDB replica-set transactions in the payments worker.

## Implemented API

`POST /api/auth/register`, `login`, `refresh`, `logout`, `logout-all`; `GET /api/me`; ride estimation, creation, listing, ownership-protected details and lifecycle updates; driver availability/location; wallet and transactions; notifications; ride-authorized chat history; and a role-protected admin overview.

Socket events authenticate with an access token, enforce ride membership before joining a room or sending chat, and persist messages before delivery.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev        # API :4000
npm run dev:web    # web :5173
```

Run MongoDB as a replica set for wallet/payment transactions. Set strong unique JWT secrets and a restrictive `CORS_ORIGIN` before production. The API intentionally refuses to embed credentials.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
docker build -t creemy .
```

## Production integrations still requiring credentials

MongoDB, Redis, Stripe secret/webhook keys, a maps/geocoding provider, and optional object storage plus email/SMS providers. Stripe PaymentIntent/webhook handlers must only be enabled after the Stripe credentials are configured; the client must never decide payment success.

## Security

Helmet, CORS credential rules, auth rate limiting, input bounds, password hashing, HttpOnly strict refresh cookies, rotation/replay rejection, revocation, role and per-resource authorization, non-enumerable error responses, and request IDs are included. Keep TLS termination, secrets management, CSRF origin controls, Redis adapter, Stripe webhooks, and monitoring configured at deployment.
