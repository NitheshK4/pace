<p align="center">
  <img src="https://img.shields.io/badge/Pace-LLM%20Observability-blueviolet?style=for-the-badge&logoColor=white" alt="Pace" />
</p>

<h1 align="center">⚡ Pace</h1>

<p align="center">
  <strong>Self-Hosted LLM Usage, Cost & Reliability Observability Platform</strong>
</p>

<p align="center">
  <em>Know exactly what your AI spends, before it surprises you.</em>
</p>

<p align="center">
  <a href="#-quickstart"><img src="https://img.shields.io/badge/setup-under%205%20min-brightgreen?style=flat-square" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/stack-FastAPI%20%7C%20Next.js%20%7C%20PostgreSQL-blue?style=flat-square" /></a>
  <a href="#-privacy--security"><img src="https://img.shields.io/badge/privacy-zero%20content%20storage-critical?style=flat-square" /></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/version-0.1.0-orange?style=flat-square" />
</p>

<br/>

<p align="center">
  <code>pip install pace-sdk</code> → wrap your OpenAI/Anthropic client → get full cost & latency visibility.
</p>

---

## 🧠 The Problem

You're shipping LLM-powered features fast. But do you know:

- 💸 How much your `gpt-4o` calls cost **this week**?
- 🐌 Which model has the worst **p95 latency**?
- 🚨 When your Anthropic rate limits **spiked at 3 AM**?
- 📊 Whether your **monthly AI budget** is already 80% burned by day 15?

Most teams find out from the **billing page** — after the damage is done.

**Pace catches it in real-time**, before it hits your invoice.

---

## ✨ What Makes Pace Different

| Feature | Pace | Generic APM | Provider Dashboard |
|---|---|---|---|
| **Self-hosted** (your infra, your data) | ✅ | ❌ | ❌ |
| **Zero content storage** (no prompts/completions ever logged) | ✅ | ❌ | N/A |
| **1-line SDK integration** | ✅ | ❌ | N/A |
| **Zero-code proxy mode** | ✅ | ❌ | N/A |
| **Multi-provider** (OpenAI + Anthropic) | ✅ | Partial | ❌ |
| **Budget alerts with deduplication** | ✅ | ❌ | ❌ |
| **Anomaly detection** (cost spikes, rate limit surges) | ✅ | ❌ | ❌ |
| **Live tail SSE stream** | ✅ | ❌ | ❌ |
| **Versioned pricing registry** | ✅ | ❌ | ❌ |
| **CSV export with audit trail** | ✅ | ❌ | ❌ |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                             YOUR APPLICATIONS                                │
│                                                                              │
│  ┌──────────────────────────────┐       ┌──────────────────────────────┐     │
│  │    Python App + pace-sdk     │       │   Any App + Pace Local Proxy │     │
│  │  track(OpenAI(...))          │       │      127.0.0.1:8787          │     │
│  │  track(Anthropic(...))       │       │   (zero-code, language-      │     │
│  │                              │       │    agnostic forwarding)      │     │
│  └──────────┬───────────────────┘       └──────────┬───────────────────┘     │
└─────────────┼──────────────────────────────────────┼────────────────────────-┘
              │                                      │
              │  Telemetry (Bearer pace_...)          │
              │  Non-blocking, resilient              │
              ▼                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           PACE CORE STACK                                    │
│                                                                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────────┐     │
│  │   FastAPI API    │  │  Next.js Console │  │   PostgreSQL Engine     │     │
│  │   :8000          │  │  :3000           │  │   :5432                 │     │
│  │                  │  │                  │  │                         │     │
│  │  • /v1/ingest    │  │  • Dashboard     │  │  • usage_events         │     │
│  │  • /v1/analytics │  │  • Live Tail     │  │  • pricing_rates        │     │
│  │  • /v1/budgets   │  │  • Budget Mgmt   │  │  • budgets              │     │
│  │  • /v1/exports   │  │  • Pricing Reg.  │  │  • alert_deliveries     │     │
│  │  • /healthz      │  │  • Quickstart    │  │  • audit_logs           │     │
│  │  • /metrics      │  │  • System Diag.  │  │  • project_api_keys     │     │
│  └─────────────────┘  └──────────────────┘  └─────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐      │
│  │                    Background Worker (60s cycle)                    │      │
│  │    • Budget threshold evaluation & deduplicated alerts             │      │
│  │    • Anomaly detection (cost spikes, rate limit surges)            │      │
│  │    • Data retention enforcement                                    │      │
│  └────────────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

> **Prerequisites**: Docker & Docker Compose installed.

### 1. Clone & Launch

```bash
git clone https://github.com/NitheshK4/pace.git
cd pace
docker compose up --build -d
```

### 2. Verify Services

| Service | URL | Purpose |
|---|---|---|
| Web Console | `http://localhost:3000` | Dashboard & management UI |
| API Health | `http://localhost:8000/healthz` | Backend health check |
| Prometheus Metrics | `http://localhost:8000/metrics` | Operational metrics |

### 3. Demo Login

A demo user is auto-seeded on first launch:

```
Email:    demo@pace.dev
Password: PaceDemo123!
```

### 4. Create Your First Project

1. Log in to the Web Console
2. Click **New Project** → name it (e.g., `"Production Chat Bot"`)
3. Copy the one-time ingestion key (`pace_...`) — **this is shown only once**

---

## 📦 Integration

Pace offers **two integration modes** — pick what fits your workflow:

### Mode A: Python SDK (1 Line of Code)

```bash
pip install pace-sdk openai
```

```python
from openai import OpenAI
from pace import track

# Wrap your existing client — that's it.
client = track(
    OpenAI(),
    api_key="pace_YOUR_KEY",
    endpoint="http://localhost:8000",
    metadata={"service": "chatbot", "environment": "production"}
)

# Use the client exactly as before. Telemetry flows automatically.
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}]
)
```

**Also works with Anthropic:**

```python
from anthropic import Anthropic
from pace import track

client = track(
    Anthropic(),
    api_key="pace_YOUR_KEY",
    endpoint="http://localhost:8000"
)

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello from Pace!"}]
)
```

#### How the SDK Works Under the Hood

```
Your Code                SDK Wrapper              Pace Backend
    │                        │                         │
    ├─ .create(...)         │                         │
    │                       ├─ Start timer            │
    │                       ├─ Forward to provider ──►│ (OpenAI / Anthropic)
    │                       │◄── Response ────────────│
    │                       ├─ Extract: model, tokens,│
    │                       │   latency, status_code  │
    │                       ├─ Sanitize metadata      │
    │                       ├─ Enqueue telemetry ────►│ Background thread
    │◄── Response ──────────│                         │ (non-blocking)
    │                        │                         │
```

- **Non-blocking**: Telemetry is enqueued to an in-memory buffer and flushed by a background daemon thread
- **Resilient**: Queue overflows are dropped silently (never crashes your app)
- **Retries**: Failed sends retry 3× with exponential backoff (0.5s → 1s → 2s)
- **Batch-optimized**: Events are batched (up to 20) and flushed every 2 seconds

### Mode B: Local Proxy (Zero-Code)

For non-Python apps or when you don't want to modify any code:

```bash
# Start the proxy
pip install pace-proxy
pace-proxy

# Or with environment variables:
PACE_ENDPOINT=http://localhost:8000 \
PACE_API_KEY=pace_YOUR_KEY \
pace-proxy
```

Then point your LLM client to the proxy instead of the provider:

```bash
# Instead of https://api.openai.com/v1/chat/completions
# Use:       http://127.0.0.1:8787/v1/chat/completions

curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Authorization: Bearer sk-your-openai-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

The proxy transparently forwards requests, extracts telemetry from responses, and reports to Pace — all without touching your application code.

> **🔒 Security**: The proxy binds to `127.0.0.1` (loopback only) by default. It never stores or logs your API keys, prompts, or completions.

---

## 📊 Features Deep Dive

### Dashboard Overview
Real-time KPI cards showing:
- **Total Spend** (USD) with cost provenance tracking
- **Request Count** across all models
- **Token Breakdown**: input, output, cached, reasoning
- **Latency Percentiles**: avg and estimated p95
- **Error Rate** and **Rate Limit Count** (HTTP 429s)
- **Unknown Cost Events**: flagged when a model isn't in the pricing registry

### Live Tail
Server-Sent Events (SSE) stream for watching LLM calls arrive in real-time. Every new ingestion event is pushed to the browser instantly — no polling, no refresh.

### Timeseries Analytics
Hourly or daily bucketed charts for spend, requests, tokens, and errors. Filter by provider, model, status code, and custom time ranges.

### Model & Provider Breakdown
See exactly which models burn the most budget. Breakdown by provider (OpenAI vs Anthropic) and individual model with percentage share.

### Budget Alerts

```
┌─────────────────────────────────────────────────────┐
│  Budget: "Production Monthly Cap"                   │
│  Limit:  $500.00 / monthly                          │
│  Metric: spend                                      │
│                                                     │
│  Thresholds: 50% │ 80% │ 100% │ 120%               │
│                ▲              ▲                      │
│             warning       critical                  │
│                                                     │
│  Destinations: console, webhook, slack, email       │
│  Cool-down: 60 min (prevents alert spam)            │
│  Deduplication: per-threshold, per-period           │
└─────────────────────────────────────────────────────┘
```

- Configure budgets by **spend**, **tokens**, **requests**, or **error rate**
- Periods: daily, weekly, monthly, or rolling 24h
- Multi-threshold alerts with **automatic deduplication** (same threshold won't fire twice per period)
- Quiet hours support and configurable cool-down windows

### Anomaly Detection
The background worker runs a 60-second evaluation cycle:
- **Cost Spike**: Flags when the last hour's spend exceeds **3× the 7-day hourly baseline**
- **Rate Limit Surge**: Alerts when HTTP 429 errors exceed **10 in the past hour**
- Minimum sample safeguards to avoid false positives

### Pricing Registry
Versioned, auditable pricing rates for cost estimation:

| Provider | Models | Pre-seeded |
|---|---|---|
| OpenAI | `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini` | ✅ |
| Anthropic | `claude-3-5-sonnet`, `claude-3-5-haiku`, `claude-3-opus` | ✅ |

- Supports input, output, cached read, and reasoning token pricing
- Automatic fallback for dated model variants (e.g., `gpt-4o-2024-05-13` → `gpt-4o`)
- Unknown models → `cost_usd = NULL` with `cost_reason = "unknown_model"` (never guesses)
- Add custom rates via API or console

### CSV Export
One-click export of usage events with full audit trail. Exports include: event ID, timestamp, provider, model, token counts, estimated cost, latency, and status code.

---

## 🔐 Privacy & Security

Pace is built on a **zero-trust, privacy-first** architecture:

| Principle | Implementation |
|---|---|
| **Zero Content Storage** | Prompts, completions, system messages, and raw API keys are **NEVER** persisted or logged |
| **Hashed Ingestion Keys** | `pace_...` keys are shown once on creation, stored as **salted HMAC-SHA256** hashes |
| **SDK Privacy Filter** | Metadata is sanitized through a denylist (`prompt`, `completion`, `messages`, `content`, `authorization`, `api_key`, `secret`, `password`) before transmission |
| **Loopback-Only Proxy** | Local proxy binds to `127.0.0.1` by default — never exposed to network |
| **Non-Blocking Telemetry** | SDK/proxy failures drop safely in memory — never affects your LLM calls |
| **Audit Logging** | All administrative actions (budget create/delete, pricing changes, CSV exports) are logged with user ID and timestamp |
| **CORS Restricted** | Configurable origin allowlist for API access |

---

## 🗂️ Project Structure

```
pace/
├── apps/
│   ├── api/                        # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/v1/             # Route handlers
│   │   │   │   ├── analytics.py    #   Dashboard KPIs, timeseries, breakdown, live-tail
│   │   │   │   ├── auth.py         #   JWT authentication (register, login, me)
│   │   │   │   ├── budgets.py      #   Budget CRUD & alert history
│   │   │   │   ├── exports.py      #   CSV export with audit trail
│   │   │   │   ├── ingest.py       #   Telemetry ingestion (single & batch)
│   │   │   │   ├── pricing.py      #   Pricing rate registry management
│   │   │   │   ├── projects.py     #   Multi-project management
│   │   │   │   ├── api_keys.py     #   Ingestion key lifecycle
│   │   │   │   └── system.py       #   Health, diagnostics, retention purge
│   │   │   ├── core/               # Config, DB engine, security, logging
│   │   │   ├── models/             # SQLAlchemy ORM models (8 tables)
│   │   │   ├── schemas/            # Pydantic request/response schemas
│   │   │   ├── services/           # Budget evaluation, anomaly detection, alert delivery
│   │   │   └── worker/             # Background scheduler (60s loop)
│   │   ├── alembic/                # Database migrations
│   │   ├── tests/                  # API test suite
│   │   └── Dockerfile
│   │
│   └── web/                        # Next.js 14 App Router frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/         # Login & registration pages
│       │   │   └── (dashboard)/    # Dashboard, explorer, live-tail, budgets,
│       │   │                       # pricing, quickstart, system settings
│       │   ├── components/         # Navbar, Sidebar, Modals
│       │   └── lib/                # API client utilities
│       └── Dockerfile
│
├── packages/
│   ├── python-sdk/                 # pace-sdk PyPI package
│   │   └── pace/
│   │       ├── __init__.py         # Public API: track(), flush()
│   │       ├── client.py           # OpenAI & Anthropic client wrapping
│   │       ├── queue.py            # ResilientTelemetryQueue (threaded, batched)
│   │       ├── privacy.py          # Metadata sanitization & denylist
│   │       └── adapters/           # Provider-specific telemetry extractors
│   │
│   └── proxy/                      # pace-proxy local forwarding proxy
│       └── pace_proxy/
│           └── server.py           # FastAPI proxy with provider allowlist
│
├── docs/                           # Documentation & demo scripts
├── docker-compose.yml              # One-command full stack deployment
├── .env.example                    # Configuration reference
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **API** | FastAPI + SQLAlchemy 2.0 (async) | High-performance async Python with type safety |
| **Database** | PostgreSQL 15 | Battle-tested relational engine with NUMERIC precision for cost tracking |
| **Migrations** | Alembic | Reliable schema versioning |
| **Frontend** | Next.js 14 (App Router) | React Server Components + client interactivity |
| **Auth** | JWT (HS256) | Stateless authentication with 7-day token expiry |
| **SDK Transport** | httpx | Modern async/sync HTTP client |
| **Proxy** | FastAPI + httpx | Lightweight reverse proxy with streaming support |
| **Deployment** | Docker Compose | Single-command, self-contained deployment |

---

## ⚙️ Configuration

All configuration is through environment variables. See [`.env.example`](.env.example) for the full reference:

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://pace:pace@db:5432/pace` | Async database connection |
| `SECRET_KEY` | *(change in prod)* | JWT signing secret (min 16 chars) |
| `INGESTION_KEY_SALT` | *(change in prod)* | HMAC salt for key hashing (min 16 chars) |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed frontend origins |
| `DEMO_MODE` | `false` | Auto-seed demo user on startup |
| `DATA_RETENTION_DAYS` | `90` | Days before old events are purged |
| `WORKER_ENABLED` | `true` | Enable background budget/anomaly worker |
| `TIMESCALE_ENABLED` | `false` | TimescaleDB hypertable support (future) |

---

## 🧪 API Reference

### Ingestion

```bash
# Single event
POST /v1/ingest/events
Authorization: Bearer pace_...

{
  "event_id": "evt_unique_123",
  "provider": "openai",
  "model": "gpt-4o",
  "input_tokens": 1200,
  "output_tokens": 400,
  "cached_input_tokens": 0,
  "reasoning_tokens": 0,
  "latency_ms": 350,
  "status_code": 200,
  "metadata": {"service": "chatbot", "environment": "prod"}
}

# Batch ingestion
POST /v1/ingest/events
{ "events": [ ... ] }
```

### Analytics

```bash
GET /v1/analytics/overview?project_id=...&start_time=...&end_time=...
GET /v1/analytics/timeseries?project_id=...&granularity=hour|day
GET /v1/analytics/breakdown?project_id=...
GET /v1/analytics/events?project_id=...&provider=openai&model=gpt-4o&limit=50
GET /v1/analytics/live-tail?project_id=...          # SSE stream
```

### Management

```bash
POST   /v1/auth/register
POST   /v1/auth/login
GET    /v1/auth/me

POST   /v1/projects
GET    /v1/projects

POST   /v1/projects/{id}/keys
GET    /v1/projects/{id}/keys
DELETE /v1/projects/{id}/keys/{key_id}

GET    /v1/pricing
POST   /v1/pricing

GET    /v1/budgets?project_id=...
POST   /v1/budgets
DELETE /v1/budgets/{id}
GET    /v1/budgets/alerts?project_id=...

GET    /v1/exports/csv?project_id=...
```

### System

```bash
GET    /healthz                     # Health check
GET    /metrics                     # Prometheus metrics
GET    /v1/system/diagnostics       # DB stats, event counts
POST   /v1/system/retention/purge   # Manual data cleanup
```

---

## 📈 Database Schema

8 tables, production-indexed:

```
users ─────────────┐
                    │ 1:N
project_members ◄──┤
                    │
projects ──────────┤
    │               │
    ├── project_api_keys    (HMAC-SHA256 hashed)
    ├── usage_events        (composite indexes on project+time, project+provider+model)
    ├── budgets             (multi-threshold, multi-metric)
    ├── alert_deliveries    (deduplicated per threshold per period)
    └── audit_logs          (immutable action trail)

pricing_rates               (versioned, provider+model+effective_from unique)
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ☕ and a healthy fear of surprise LLM invoices.
</p>
