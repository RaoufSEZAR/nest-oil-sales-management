# Deploy BK (NestJS API) to Render — Docker + Production

This guide deploys the **Oil Sales** backend (`BK/`) on [Render](https://render.com) as a **Docker Web Service**, with a **Render PostgreSQL** database and production environment variables.

---

## Architecture on Render

| Render resource | Purpose |
|-----------------|--------|
| **PostgreSQL** | Production database |
| **Web Service (Docker)** | NestJS API (`BK/Dockerfile`) |

Public API (deployed):

| Resource | URL |
|----------|-----|
| **API base** | `https://nest-oil-sales-management.onrender.com/api/v1` |
| **Health** | `https://nest-oil-sales-management.onrender.com/api/v1/health` |
| **Swagger** | `https://nest-oil-sales-management.onrender.com/docs` |
| **Root** | `https://nest-oil-sales-management.onrender.com/` |

---

## Prerequisites

1. Git repository pushed to GitHub / GitLab / Bitbucket (Render connects to it).
2. Render account.
3. **Do not commit secrets** in `config.env`. Set secrets only in the Render dashboard (or use a secret manager). Rotate any keys that were ever committed.

---

## Step 1 — Create PostgreSQL on Render

1. In Render: **New +** → **PostgreSQL**.
2. Choose a name (e.g. `oil-sales-db`), region, and plan.
3. After creation, open the database → **Info** / **Connections**.
4. Note:
   - **Internal Database URL** (use this from your Web Service on Render)
   - **External Database URL** (use from your laptop for tools like pgAdmin)

Parse the URL into variables (example shape):

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

| Variable | Maps from URL |
|----------|----------------|
| `DB_USERNAME` | user |
| `DB_PASSWORD` | password |
| `DB_HOST` | host |
| `DB_PORT` | `5432` (usually) |
| `DB_NAME` | database name |

---

## Step 2 — Create Docker Web Service

1. **New +** → **Web Service**.
2. Connect your repository.
3. Use these settings:

| Setting | Value |
|---------|--------|
| **Name** | `oil-sales-api` (or your choice) |
| **Region** | Same as PostgreSQL (lower latency) |
| **Branch** | `main` (or your deploy branch) |
| **Root Directory** | `BK` |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `Dockerfile` (relative to `BK`, i.e. `BK/Dockerfile`) |
| **Docker Context** | `.` (default; context is `BK` because of Root Directory) |

Render sets **`PORT`** automatically. The app reads it in `src/main.ts` (`process.env.PORT || 3000`).

### Health check (recommended)

| Setting | Value |
|---------|--------|
| **Health Check Path** | `/api/v1/health` |

Returns JSON with `status: "ok"` when the app is up.

### Instance type

- **Free**: spins down when idle; cold starts are slow.
- **Starter+**: better for production demos and stable latency.

---

## Step 3 — Production environment variables

In the Web Service → **Environment** → add:

### Required

| Key | Example / notes |
|-----|------------------|
| `NODE_ENV` | `production` |
| `PORT` | Leave empty — Render injects it. If you set it manually, use `10000` only if Render docs require it for your plan; usually **do not override**. |
| `DB_HOST` | From Render Postgres host (e.g. `dpg-xxxxx-a.oregon-postgres.render.com`) |
| `DB_PORT` | `5432` |
| `DB_USERNAME` | From Postgres credentials |
| `DB_PASSWORD` | From Postgres credentials |
| `DB_NAME` | From Postgres credentials |
| `DB_SSL` | `true` |
| `JWT_SECRET` | Long random string (≥ 32 chars). Generate: `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | `24h` (or `15m` for stricter access tokens) |

### Your Render Postgres URLs

| Use case | Connection |
|----------|------------|
| **API on Render** (Web Service env vars) | Internal URL / internal host |
| **Your PC** (psql, pgAdmin, schema import) | External URL |

**Internal** (Web Service on Render):

```text
postgresql://oil_sales_db_user:Cwjq8c1YE0CSsjDDX4iQ8M4Wuan7urSu@dpg-d84dmvmgvqtc7382cu80-a/oil_sales_db
```

**External** (local machine):

```text
postgresql://oil_sales_db_user:Cwjq8c1YE0CSsjDDX4iQ8M4Wuan7urSu@dpg-d84dmvmgvqtc7382cu80-a.oregon-postgres.render.com/oil_sales_db
```

The BK app does **not** read `DATABASE_URL`; split the URL into `DB_*` variables below.

### Copy-paste for your Render Web Service

Use **internal** host (no `.oregon-postgres.render.com` suffix):

```env
NODE_ENV=production
DB_HOST=dpg-d84dmvmgvqtc7382cu80-a
DB_PORT=5432
DB_USERNAME=oil_sales_db_user
DB_PASSWORD=Cwjq8c1YE0CSsjDDX4iQ8M4Wuan7urSu
DB_NAME=oil_sales_db
DB_SSL=true
DB_SYNCHRONIZE=true
JWT_SECRET=<generate: openssl rand -base64 48>
JWT_EXPIRES_IN=24h
```

Do **not** commit `DB_PASSWORD` or `JWT_SECRET` to a public repo. Set them in the Render dashboard only.

After the first successful deploy, set **`DB_SYNCHRONIZE=false`**.

### Connect from your PC (schema import / psql)

```bash
psql "postgresql://oil_sales_db_user:Cwjq8c1YE0CSsjDDX4iQ8M4Wuan7urSu@dpg-d84dmvmgvqtc7382cu80-a.oregon-postgres.render.com/oil_sales_db?sslmode=require"
```

Or export local DB and import:

```bash
pg_dump -h localhost -p 5433 -U postgres -d oil-sales-app --no-owner --no-acl | psql "postgresql://oil_sales_db_user:Cwjq8c1YE0CSsjDDX4iQ8M4Wuan7urSu@dpg-d84dmvmgvqtc7382cu80-a.oregon-postgres.render.com/oil_sales_db?sslmode=require"
```

**Link database (optional):** In the Web Service, use **Add from Render PostgreSQL** to attach the DB; Render can inject connection variables. Rename them to match `DB_HOST`, `DB_USERNAME`, etc., if Render uses different key names (e.g. map `DATABASE_URL` manually or split into the fields above).

---

## How configuration is loaded

`ConfigModule` in `src/app.module.ts` reads `config.env` **and** process environment variables. On Render, **dashboard env vars override** file values.

- Do **not** rely on uploading `config.env` with production secrets.
- Keep `config.env` for local development only, or remove secrets from it before pushing.
- For production, copy from `production.env` (gitignored) or `production.env.example` → `production.env`.

---

## Step 4 — Database schema (important)

On first deploy, Render Postgres is **empty**. The API needs tables before startup (e.g. `expense_categories` seed on boot). Error **`42P01`** = relation does not exist.

### First deploy: enable `DB_SYNCHRONIZE`

Add to Render Web Service → **Environment**:

```env
DB_SYNCHRONIZE=true
```

TypeORM will create all tables on startup when this is `true` (even with `NODE_ENV=production`).

1. Deploy and confirm the service stays **Live** (`/api/v1/health` returns OK).
2. Set **`DB_SYNCHRONIZE=false`** (or remove the variable) and redeploy so schema is not auto-altered on every restart.

Also include in your env block:

```env
DB_SYNCHRONIZE=true
```

(alongside `DB_HOST`, `DB_SSL`, etc.)

### Alternative: import from local dev

If you already have data locally:

```bash
pg_dump -h localhost -p 5433 -U postgres -d oil-sales-app --no-owner --no-acl | psql "postgresql://...@dpg-....oregon-postgres.render.com/oil_sales_db?sslmode=require"
```

Then keep `DB_SYNCHRONIZE=false`.

---

## Step 5 — Deploy

1. Click **Create Web Service** (or **Manual Deploy** → **Deploy latest commit**).
2. Render builds the image from `BK/Dockerfile`:
   - `npm ci` → `npm run build` → production `node_modules`
   - Starts: `node dist/src/main.js`
3. Watch **Logs** for:
   - `Application is running on: http://localhost:...`
   - No TypeORM connection errors

### Verify

```bash
curl https://<your-service>.onrender.com/api/v1/health
```

Expected: `{"status":"ok",...}`

```bash
curl https://<your-service>.onrender.com/
```

Expected: `Oil Sales API is running!`

---

## Step 6 — Point frontends to production API

Update manager / center / admin frontends:

Each frontend uses `VITE_RESTAPI_URL` in `.env.production`:

```env
VITE_RESTAPI_URL=https://nest-oil-sales-management.onrender.com/api/v1
```

Already set in `manager-FE`, `center-FE`, and `user-FE`. Rebuild and redeploy each static site after changing.

Enable **CORS** is already global in `main.ts` (`app.enableCors()`). For strict production, restrict origins in code later.

---

## Recommended `.dockerignore` (optional)

Create `BK/.dockerignore` to speed up builds:

```gitignore
node_modules
dist
.git
.env
.env.*
config.env
*.md
coverage
.vscode
.idea
docker-compose.yml
```

---

## Docker reference (local test before Render)

From repo root:

```bash
cd BK
docker build -t oil-sales-api .
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=your-host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=your-user \
  -e DB_PASSWORD=your-password \
  -e DB_NAME=your-db \
  -e DB_SSL=true \
  -e JWT_SECRET=your-secret \
  -e JWT_EXPIRES_IN=24h \
  oil-sales-api
```

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| `Access denied. Required roles: ...` | Redeploy latest image; ensure code includes `MANAGER` on ERP routes. |
| DB connection timeout | `DB_SSL=true`, correct host/port, Postgres and Web Service in same region. |
| App crashes on start | Logs for TypeORM/auth; missing `JWT_SECRET` or DB vars. |
| `42P01` / crash on deploy / empty tables | Add `DB_SYNCHRONIZE=true`, redeploy, then set `false`; see **Step 4**. |
| 502 on free tier | Cold start; wait 30–60s or upgrade plan. |
| CORS errors from browser | API URL must include `/api/v1`; FE must use HTTPS in production. |

---

## Security checklist (production)

- [ ] Strong unique `JWT_SECRET`
- [ ] `config.env` with real passwords **not** in git (add `config.env` to `.gitignore` if it contains secrets)
- [ ] `DB_SSL=true` for Render Postgres
- [ ] `NODE_ENV=production`
- [ ] Rotate DB password and JWT secret if they were ever exposed
- [ ] Restrict Swagger (`/docs`) in production if the API is public (optional hardening)

---

## Render summary

| Item | Value |
|------|--------|
| Root Directory | `BK` |
| Runtime | Docker |
| Dockerfile | `BK/Dockerfile` |
| Start command | (from Dockerfile) `node dist/src/main.js` |
| Health check | `/api/v1/health` |
| Database | Render PostgreSQL + `DB_SSL=true` |
| API prefix | `/api/v1` |

---

## Related files in this repo

| File | Role |
|------|------|
| `BK/Dockerfile` | Production image build |
| `BK/docker-compose.yml` | Local dev (Postgres + app) |
| `BK/config.env` | Local env template (do not use for Render secrets) |
| `BK/src/app.module.ts` | DB + `NODE_ENV` / `DB_SSL` behavior |
