<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=40&duration=3000&pause=1000&color=6C63FF&center=true&vCenter=true&multiline=true&width=600&height=80&lines=%E2%9A%A1+P+A+C+E" alt="Pace" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=18&duration=4000&pause=2000&color=A78BFA&center=true&vCenter=true&width=700&lines=Self-Hosted+LLM+Observability+%E2%80%A2+Cost+Tracking+%E2%80%A2+Anomaly+Detection;Know+what+your+AI+spends%2C+before+it+surprises+you." alt="Tagline" />
</p>

<p align="center">
  <a href="#-quickstart"><img src="https://img.shields.io/badge/%F0%9F%9A%80_Setup-Under_5_Min-00C853?style=for-the-badge&labelColor=1a1a2e" /></a>
  &nbsp;
  <a href="#-integration"><img src="https://img.shields.io/badge/%F0%9F%93%A6_SDK-1_Line_Integration-7C4DFF?style=for-the-badge&labelColor=1a1a2e" /></a>
  &nbsp;
  <a href="#-privacy--security"><img src="https://img.shields.io/badge/%F0%9F%94%90_Privacy-Zero_Content_Storage-FF1744?style=for-the-badge&labelColor=1a1a2e" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue?style=flat-square&labelColor=334155" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&labelColor=334155" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square&labelColor=334155" />
  <img src="https://img.shields.io/badge/providers-OpenAI_%7C_Anthropic-orange?style=flat-square&labelColor=334155" />
</p>

---

## 🧠 The Problem

You're shipping LLM-powered features fast. But do you know:

> [!WARNING]
> 💸 How much your `gpt-4o` calls cost **this week**?
> 🐌 Which model has the worst **p95 latency**?
> 🚨 When your Anthropic rate limits **spiked at 3 AM**?
> 📊 Whether your **monthly AI budget** is already 80% burned by day 15?

Most teams find out from the **billing page** — after the damage is done.

> [!TIP]
> **Pace catches it in real-time**, before it hits your invoice. Self-hosted, privacy-first, and deployable in under 5 minutes.

---

## ✨ Why Pace?

<table>
<tr>
<td width="33%" align="center">

### 🎯 1-Line Setup

```python
client = track(OpenAI())
# Done. Telemetry flows.
```

Wrap your existing OpenAI or Anthropic client. Zero config changes needed.

</td>
<td width="33%" align="center">

### 🔒 Privacy-First

```
Prompts?     ❌ Never stored
API Keys?    ❌ Never logged
Completions? ❌ Never persisted
```

Your data stays **your data**. Always.

</td>
<td width="33%" align="center">

### 🏠 Self-Hosted

```bash
docker compose up -d
# That's the whole deploy.
```

Runs on your infra. No SaaS vendor lock-in.

</td>
</tr>
</table>

<br/>

<table>
<tr>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Self--hosted-00C853?style=for-the-badge" /><br/>
  <sub>Your infra, your data</sub>
</td>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Zero_Content_Storage-FF6D00?style=for-the-badge" /><br/>
  <sub>No prompts/completions ever</sub>
</td>
<td align="center">
  <img src="https://img.shields.io/badge/✓-1--Line_SDK-7C4DFF?style=for-the-badge" /><br/>
  <sub>Instant integration</sub>
</td>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Zero--Code_Proxy-00B8D4?style=for-the-badge" /><br/>
  <sub>Language-agnostic mode</sub>
</td>
</tr>
<tr>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Multi--Provider-E91E63?style=for-the-badge" /><br/>
  <sub>OpenAI + Anthropic</sub>
</td>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Budget_Alerts-FFAB00?style=for-the-badge" /><br/>
  <sub>Deduplicated thresholds</sub>
</td>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Anomaly_Detection-F44336?style=for-the-badge" /><br/>
  <sub>Cost spikes & rate limits</sub>
</td>
<td align="center">
  <img src="https://img.shields.io/badge/✓-Live_Tail_SSE-00E676?style=for-the-badge" /><br/>
  <sub>Real-time event stream</sub>
</td>
</tr>
</table>

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
└─────────────┼──────────────────────────────────────┼─────────────────────────┘
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

> [!NOTE]
> **Prerequisites**: Docker & Docker Compose installed. That's it.

### 1️⃣ Clone & Launch

```bash
git clone https://github.com/NitheshK4/pace.git
cd pace
docker compose up --build -d
```

### 2️⃣ Verify Services

| Service | URL | Status |
|:---|:---|:---:|
| 🖥️ **Web Console** | `http://localhost:3000` | <img src="https://img.shields.io/badge/PORT-3000-6C63FF?style=flat-square" /> |
| ⚙️ **API Health** | `http://localhost:8000/healthz` | <img src="https://img.shields.io/badge/PORT-8000-00C853?style=flat-square" /> |
| 📈 **Prometheus** | `http://localhost:8000/metrics` | <img src="https://img.shields.io/badge/PORT-8000-FF6D00?style=flat-square" /> |

### 3️⃣ Demo Login

> [!TIP]
> A demo user is auto-seeded on first launch — no registration required!

```
📧 Email:    demo@pace.dev
🔑 Password: PaceDemo123!
```

### 4️⃣ Create Your First Project

1. Log in to the Web Console
2. Click **New Project** → name it (e.g., `"Production Chat Bot"`)
3. Copy the one-time ingestion key (`pace_...`) — ⚠️ **shown only once!**

---

## 📦 Integration

Pace offers **two integration modes** — pick what fits:

<table>
<tr>
<th width="50%">

### <img src="https://img.shields.io/badge/Mode_A-SDK-7C4DFF?style=flat-square" /> &nbsp; Python SDK (1 Line)

</th>
<th width="50%">

### <img src="https://img.shields.io/badge/Mode_B-Proxy-00B8D4?style=flat-square" /> &nbsp; Local Proxy (Zero-Code)

</th>
</tr>
<tr>
<td>

Best for: **Python apps** using OpenAI/Anthropic SDKs

```bash
pip install pace-sdk openai
```

</td>
<td>

Best for: **Any language**, no code changes needed

```bash
pip install pace-proxy
pace-proxy
```

</td>
</tr>
</table>

### <img src="https://img.shields.io/badge/-Mode_A-7C4DFF?style=flat-square" /> &nbsp; SDK Integration

#### OpenAI

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

#### Anthropic

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

<details>
<summary>🔍 <strong>How the SDK works under the hood</strong> (click to expand)</summary>

<br/>

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

| Property | Detail |
|:---|:---|
| <img src="https://img.shields.io/badge/-Non--blocking-00C853?style=flat-square" /> | Telemetry enqueued to in-memory buffer, flushed by daemon thread |
| <img src="https://img.shields.io/badge/-Resilient-FF6D00?style=flat-square" /> | Queue overflows dropped silently (never crashes your app) |
| <img src="https://img.shields.io/badge/-Auto--retry-2196F3?style=flat-square" /> | Failed sends retry 3× with exponential backoff (0.5s → 1s → 2s) |
| <img src="https://img.shields.io/badge/-Batched-9C27B0?style=flat-square" /> | Up to 20 events per batch, flushed every 2 seconds |

</details>

### <img src="https://img.shields.io/badge/-Mode_B-00B8D4?style=flat-square" /> &nbsp; Local Proxy

For non-Python apps or when you don't want to modify any code:

```bash
# Start the proxy
PACE_ENDPOINT=http://localhost:8000 \
PACE_API_KEY=pace_YOUR_KEY \
pace-proxy
```

Then point your LLM client to the proxy instead of the provider:

```bash
# Instead of → https://api.openai.com/v1/chat/completions
# Use        → http://127.0.0.1:8787/v1/chat/completions

curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Authorization: Bearer sk-your-openai-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

> [!IMPORTANT]
> 🔒 The proxy binds to `127.0.0.1` (loopback only) by default. It never stores or logs your API keys, prompts, or completions.

---

## 📊 Features Deep Dive

<table>
<tr>
<td width="50%">

### 📉 Dashboard Overview

Real-time KPI cards:
- 💰 **Total Spend** (USD) with cost provenance
- 📊 **Request Count** across all models
- 🔢 **Token Breakdown**: input, output, cached, reasoning
- ⏱️ **Latency Percentiles**: avg and p95
- ❌ **Error Rate** & 🚫 **Rate Limit Count**
- ❓ **Unknown Cost Events** flagged

</td>
<td width="50%">

### 🔴 Live Tail

Server-Sent Events (SSE) stream:
- ⚡ Watch LLM calls arrive **in real-time**
- 📡 Pushed to browser instantly
- 🔄 No polling, no refresh needed
- 🎯 Filter by project scope

</td>
</tr>
<tr>
<td>

### 📈 Timeseries Analytics

- ⏰ Hourly or daily bucketed charts
- 💹 Spend, requests, tokens, errors
- 🔍 Filter by provider, model, status
- 📅 Custom time range support

</td>
<td>

### 🍰 Model & Provider Breakdown

- 🏷️ See which models burn the most budget
- 🔀 Split by **provider** (OpenAI vs Anthropic)
- 📊 Percentage share visualization
- 💲 Per-model cost attribution

</td>
</tr>
</table>

### 🚨 Budget Alerts

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 Budget: "Production Monthly Cap"                            │
│  💰 Limit:  $500.00 / monthly                                   │
│  📏 Metric: spend                                               │
│                                                                  │
│  Thresholds:   50%  ──── │ ──── 80%  ──── │ ──── 100% ── 120%  │
│                  🟢 info      🟡 warning      🔴 critical       │
│                                                                  │
│  📬 Destinations: console · webhook · slack · email              │
│  ⏸️  Cool-down: 60 min (prevents alert spam)                     │
│  🔁 Deduplication: per-threshold, per-period                     │
└─────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> **Budget metrics**: Configure by `spend`, `tokens`, `requests`, or `error_rate`
> **Periods**: daily · weekly · monthly · rolling 24h
> **Smart dedup**: Same threshold won't fire twice in the same period

### 🔮 Anomaly Detection

The background worker runs a **60-second evaluation cycle**:

| Anomaly Type | Trigger | Severity |
|:---|:---|:---:|
| <img src="https://img.shields.io/badge/💸_Cost_Spike-3x_baseline-FF1744?style=flat-square" /> | Last hour's spend > **3× the 7-day hourly average** | 🔴 Critical |
| <img src="https://img.shields.io/badge/🚫_Rate_Limit_Surge-429_errors-FF6D00?style=flat-square" /> | HTTP 429 errors > **10 in the past hour** | 🟡 Warning |

> Minimum sample safeguards prevent false positives (requires 5+ recent & 20+ baseline events).

### 💲 Pricing Registry

<table>
<tr>
<th>Provider</th>
<th>Models (Pre-seeded)</th>
<th>Token Types</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" /></td>
<td><code>gpt-4o</code> · <code>gpt-4o-mini</code> · <code>o1</code> · <code>o3-mini</code></td>
<td rowspan="2">Input · Output · Cached · Reasoning</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Anthropic-D97706?style=flat-square" /></td>
<td><code>claude-3-5-sonnet</code> · <code>claude-3-5-haiku</code> · <code>claude-3-opus</code></td>
</tr>
</table>

> [!CAUTION]
> Unknown models get `cost_usd = NULL` with `cost_reason = "unknown_model"` — Pace **never guesses** your costs.

- ✅ Auto-fallback for dated variants (e.g., `gpt-4o-2024-05-13` → `gpt-4o`)
- ✅ Add custom rates via API or console
- ✅ Versioned with `effective_from` timestamps

### 📥 CSV Export

One-click export with full audit trail: event ID, timestamp, provider, model, token counts, estimated cost, latency, and status code.

---

## 🔐 Privacy & Security

> [!IMPORTANT]
> Pace is built on a **zero-trust, privacy-first** architecture. Your prompts and completions are **NEVER** stored — period.

| | Principle | Implementation |
|:---:|:---|:---|
| 🚫 | **Zero Content Storage** | Prompts, completions, system messages, raw API keys **NEVER** persisted or logged |
| 🔑 | **Hashed Ingestion Keys** | `pace_...` keys shown once, stored as **salted HMAC-SHA256** hashes |
| 🧹 | **SDK Privacy Filter** | Metadata sanitized via denylist (`prompt`, `completion`, `messages`, `content`, `authorization`, `api_key`, `secret`, `password`) |
| 🏠 | **Loopback-Only Proxy** | Local proxy binds to `127.0.0.1` — never exposed to network |
| 🛡️ | **Non-Blocking Telemetry** | SDK/proxy failures drop safely in memory — never affects your LLM calls |
| 📝 | **Audit Logging** | All admin actions logged with user ID and timestamp |
| 🌐 | **CORS Restricted** | Configurable origin allowlist for API access |

---

## 🗂️ Project Structure

```
pace/
│
├── 📂 apps/
│   ├── 📂 api/                        ← FastAPI Backend
│   │   ├── app/
│   │   │   ├── api/v1/
│   │   │   │   ├── analytics.py       # Dashboard KPIs, timeseries, breakdown, live-tail SSE
│   │   │   │   ├── auth.py            # JWT auth (register, login, me)
│   │   │   │   ├── budgets.py         # Budget CRUD & alert history
│   │   │   │   ├── exports.py         # CSV export + audit trail
│   │   │   │   ├── ingest.py          # Telemetry ingestion (single & batch, idempotent)
│   │   │   │   ├── pricing.py         # Versioned pricing registry
│   │   │   │   ├── projects.py        # Multi-project management + RBAC
│   │   │   │   ├── api_keys.py        # Ingestion key lifecycle (HMAC hashed)
│   │   │   │   └── system.py          # Health, diagnostics, retention purge
│   │   │   ├── core/                  # Config, DB engine, security, logging
│   │   │   ├── models/                # SQLAlchemy ORM (8 tables)
│   │   │   ├── schemas/               # Pydantic request/response schemas
│   │   │   ├── services/              # Budget eval, anomaly detection, alert delivery
│   │   │   └── worker/                # Background scheduler (60s cycle)
│   │   ├── alembic/                   # Database migrations
│   │   ├── tests/                     # API test suite
│   │   └── Dockerfile
│   │
│   └── 📂 web/                        ← Next.js 14 Frontend
│       ├── src/app/
│       │   ├── (auth)/                # Login & registration
│       │   └── (dashboard)/           # Dashboard, explorer, live-tail,
│       │                              # budgets, pricing, quickstart, system
│       ├── src/components/            # Navbar, Sidebar, Modals
│       ├── src/lib/                   # API client utilities
│       └── Dockerfile
│
├── 📂 packages/
│   ├── 📂 python-sdk/                 ← pace-sdk (PyPI)
│   │   └── pace/
│   │       ├── client.py              # OpenAI & Anthropic wrapper
│   │       ├── queue.py               # ResilientTelemetryQueue (threaded, batched)
│   │       ├── privacy.py             # Metadata sanitization & denylist
│   │       └── adapters/              # Provider-specific telemetry extractors
│   │
│   └── 📂 proxy/                      ← pace-proxy (Local Forwarding)
│       └── pace_proxy/server.py       # FastAPI reverse proxy + allowlist
│
├── 📂 docs/                           # Demo scripts & documentation
├── 🐳 docker-compose.yml             # One-command full stack deployment
├── 📋 .env.example                    # Configuration reference
└── 📋 .gitignore
```

---

## 🛠️ Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Why</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/API-009688?style=flat-square" /></td>
<td><strong>FastAPI</strong> + SQLAlchemy 2.0 (async)</td>
<td>High-perf async Python with type safety</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Database-4169E1?style=flat-square" /></td>
<td><strong>PostgreSQL 15</strong></td>
<td>NUMERIC precision for cost tracking</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Migrations-795548?style=flat-square" /></td>
<td><strong>Alembic</strong></td>
<td>Reliable schema versioning</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Frontend-000000?style=flat-square" /></td>
<td><strong>Next.js 14</strong> (App Router)</td>
<td>RSC + client interactivity</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Auth-FF6F00?style=flat-square" /></td>
<td><strong>JWT (HS256)</strong></td>
<td>Stateless auth, 7-day token expiry</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/HTTP-E91E63?style=flat-square" /></td>
<td><strong>httpx</strong></td>
<td>Modern async/sync HTTP client</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Deploy-2496ED?style=flat-square" /></td>
<td><strong>Docker Compose</strong></td>
<td>Single-command, self-contained</td>
</tr>
</table>

---

## ⚙️ Configuration

> All config via environment variables. See [`.env.example`](.env.example) for full reference.

| Variable | Default | Description |
|:---|:---|:---|
| `DATABASE_URL` | `postgresql+asyncpg://pace:pace@db:5432/pace` | Async DB connection |
| `SECRET_KEY` | ⚠️ *change in prod* | JWT signing secret (min 16 chars) |
| `INGESTION_KEY_SALT` | ⚠️ *change in prod* | HMAC salt for key hashing |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed frontend origins |
| `DEMO_MODE` | `false` | Auto-seed demo user on startup |
| `DATA_RETENTION_DAYS` | `90` | Days before old events purged |
| `WORKER_ENABLED` | `true` | Enable background worker |
| `TIMESCALE_ENABLED` | `false` | TimescaleDB support (future) |

---

## 🧪 API Reference

<details>
<summary><img src="https://img.shields.io/badge/POST-49CC90?style=flat-square" /> <strong>Ingestion</strong></summary>

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
  "metadata": {"service": "chatbot"}
}

# Batch ingestion
POST /v1/ingest/events
{ "events": [ ... ] }
```

</details>

<details>
<summary><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square" /> <strong>Analytics</strong></summary>

```bash
GET /v1/analytics/overview?project_id=...&start_time=...&end_time=...
GET /v1/analytics/timeseries?project_id=...&granularity=hour|day
GET /v1/analytics/breakdown?project_id=...
GET /v1/analytics/events?project_id=...&provider=openai&model=gpt-4o&limit=50
GET /v1/analytics/live-tail?project_id=...          # SSE stream
```

</details>

<details>
<summary><img src="https://img.shields.io/badge/CRUD-FCA130?style=flat-square" /> <strong>Management</strong></summary>

```bash
# Auth
POST   /v1/auth/register
POST   /v1/auth/login
GET    /v1/auth/me

# Projects
POST   /v1/projects
GET    /v1/projects

# API Keys
POST   /v1/projects/{id}/keys
GET    /v1/projects/{id}/keys
DELETE /v1/projects/{id}/keys/{key_id}

# Pricing
GET    /v1/pricing
POST   /v1/pricing

# Budgets & Alerts
GET    /v1/budgets?project_id=...
POST   /v1/budgets
DELETE /v1/budgets/{id}
GET    /v1/budgets/alerts?project_id=...

# Exports
GET    /v1/exports/csv?project_id=...
```

</details>

<details>
<summary><img src="https://img.shields.io/badge/SYS-F93E3E?style=flat-square" /> <strong>System</strong></summary>

```bash
GET    /healthz                     # Health check
GET    /metrics                     # Prometheus metrics
GET    /v1/system/diagnostics       # DB stats, event counts
POST   /v1/system/retention/purge   # Manual data cleanup
```

</details>

---

## 📈 Database Schema

**8 tables**, production-indexed:

```
┌──────────┐       ┌───────────────────┐
│  users   │──1:N──│ project_members   │
└────┬─────┘       └───────────────────┘
     │ 1:N
┌────▼─────┐
│ projects │
└────┬─────┘
     │
     ├──── project_api_keys       🔑 HMAC-SHA256 hashed
     ├──── usage_events           📊 Composite indexes (project+time, project+provider+model)
     ├──── budgets                💰 Multi-threshold, multi-metric
     ├──── alert_deliveries       🚨 Deduplicated per threshold per period
     └──── audit_logs             📝 Immutable action trail

┌──────────────┐
│ pricing_rates│                  💲 Versioned (provider+model+effective_from unique)
└──────────────┘
```

---

## 🤝 Contributing

<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" />

1. **Fork** the repo
2. **Branch**: `git checkout -b feature/amazing-feature`
3. **Commit**: `git commit -m 'Add amazing feature'`
4. **Push**: `git push origin feature/amazing-feature`
5. **PR**: Open a Pull Request

---

## 📄 License

<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&duration=4000&pause=2000&color=6C63FF&center=true&vCenter=true&width=500&lines=Built+with+%E2%98%95+and+a+healthy+fear+of+surprise+LLM+invoices." alt="Footer" />
</p>

<p align="center">
  <a href="https://github.com/NitheshK4/pace">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-if_it_helped!-yellow?style=for-the-badge" />
  </a>
</p>
