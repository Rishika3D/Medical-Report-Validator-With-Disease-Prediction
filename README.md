# 🏥 MediChain — Blockchain-Anchored Medical Report Validation + AI Analysis

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-20%2B-green)
![Python](https://img.shields.io/badge/Python-3.12-yellow)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-lightgrey)

A full-stack decentralized application that lets clinicians **upload medical reports**, runs **AI analysis** on them, pins the original to **IPFS**, and anchors a tamper-proof **SHA-256 hash on Ethereum** so any document can later be **verified** or **revoked**.

---

## ✨ Features

- **Authentication** — JWT-based signup/login with bcrypt-hashed passwords and patient/doctor roles.
- **Submit** — hash a report, run AI analysis, pin to IPFS, write proof on-chain, index in Postgres.
- **Verify** — re-hash an uploaded document and compare against the latest on-chain record (detects tampering & revocation).
- **Repudiate** — admins can revoke a previously recorded report on-chain.
- **History** — per-user record of submissions and verifications.
- **AI analysis** — real HuggingFace Inference calls with graceful, clearly-labelled fallback.
- **Production hardening** — rate limiting, CORS allowlist, Helmet, structured logging, centralized error handling, health checks.

---

## 🧱 Architecture

```
┌────────────┐     ┌─────────────┐     ┌────────────────┐
│  Frontend  │ ──▶ │   Backend   │ ──▶ │  Postgres DB   │
│ Next.js 16 │     │  Express 5  │     └────────────────┘
└────────────┘     │             │ ──▶ ┌────────────────┐
                   │             │     │  ML service    │ ──▶ HuggingFace
                   │             │     │  Flask + HF    │
                   │             │     └────────────────┘
                   │             │ ──▶ ┌────────────────┐
                   │             │     │  Pinata / IPFS │
                   │             │ ──▶ ┌────────────────┐
                   └─────────────┘     │  Ethereum/Hardhat │
                                       └────────────────┘
```

| Component | Stack |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, framer-motion |
| **Backend** | Node 20, Express 5, ethers v6, pg, JWT, Helmet |
| **Blockchain** | Solidity 0.8.20, Hardhat, OpenZeppelin AccessControl |
| **ML service** | Python 3.12, Flask, HuggingFace Inference, gunicorn |
| **Database** | PostgreSQL 16 |
| **Storage** | IPFS via Pinata |

---

## 📂 Project Structure

```
.
├── frontend/        # Next.js web app
├── backend/         # Express API (auth, reports, IPFS, chain, ML)
│   ├── controllers/ services/ middleware/ db/ utils/ routes/
├── blockchain/      # Hardhat project + ReportValidator.sol
├── ml_service/      # Flask ML service (HuggingFace)
├── docker-compose.yml
├── render.yaml
└── .env.example
```

---

## 🚀 Quick Start (Docker — one command)

**Prerequisites:** Docker + Docker Compose.

```bash
cp .env.example .env          # optional: add IPFS_JWT and HF_ACCESS_TOKEN
docker compose up --build
```

This starts everything and **auto-deploys the smart contract**:

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5050/api |
| Health check | http://localhost:5050/api/health |
| ML service | http://localhost:5001 |
| Hardhat RPC | http://localhost:8545 |

> The chain container deploys `ReportValidator` and writes the contract address,
> deployer key and ABI to a shared volume that the backend reads automatically —
> no manual wiring needed.

---

## 🛠 Local Development (without Docker)

**Prerequisites:** Node 20+, Python 3.12+, PostgreSQL 16.

```bash
# 1. Database
createdb medichain

# 2. Blockchain (terminal 1)
cd blockchain && npm install
npx hardhat node                       # starts a local chain on :8545
# (terminal 2) deploy:
npx hardhat ignition deploy ./ignition/modules/DeployMedical.js --network localhost

# 3. ML service (terminal 3)
cd ml_service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                   # add HF_ACCESS_TOKEN
python app.py                          # http://localhost:5001

# 4. Backend (terminal 4)
cd backend && npm install
cp .env.example .env                   # fill in values (see below)
npm run migrate                        # create tables
npm run dev                            # http://localhost:5050

# 5. Frontend (terminal 5)
cd frontend && npm install
cp .env.example .env.local
npm run dev                            # http://localhost:3000
```

---

## 🔐 Environment Variables

### `backend/.env`
| Variable | Description |
| :--- | :--- |
| `PORT` | API port (default 5050) |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated |
| `DATABASE_URL` *or* `PGUSER/PGHOST/PGNAME/PGPASSWORD/PGPORT` | Postgres connection |
| `PGSSL` | `true` for managed Postgres |
| `JWT_SECRET` | Long random secret (`openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `IPFS_JWT` *or* `IPFS_API_KEY`+`IPFS_API_SECRET` | Pinata credentials |
| `RPC_URL` | Ethereum JSON-RPC URL |
| `PRIVATE_KEY` | Wallet with `UPLOADER_ROLE` |
| `CONTRACT_ADDRESS` | Deployed `ReportValidator` address |
| `CONTRACT_ABI_PATH` | Optional ABI override |
| `ML_SERVICE_URL` | ML service base URL |

### `ml_service/.env`
| Variable | Description |
| :--- | :--- |
| `HF_ACCESS_TOKEN` | HuggingFace token |
| `HF_XRAY_ID` / `HF_VALIDATOR_ID` | Model IDs |
| `PORT` / `ALLOWED_ORIGINS` | Server config |

### `frontend/.env.local`
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base (e.g. `http://localhost:5050/api`) |
| `NEXT_PUBLIC_EXPLORER_TX_URL` | Optional explorer base (empty for local) |

---

## ☁️ Cloud Deployment

**Frontend → Vercel:** import the repo, set **Root Directory** to `frontend`, add `NEXT_PUBLIC_API_URL` (your backend URL). Vercel auto-detects Next.js.

**Backend + ML + DB → Render:** the included [`render.yaml`](render.yaml) is a Blueprint. Create a Render Blueprint from the repo, then set the `sync: false` secrets (`IPFS_JWT`, `RPC_URL`, `PRIVATE_KEY`, `CONTRACT_ADDRESS`, `HF_ACCESS_TOKEN`, `CLIENT_URL`, `ML_SERVICE_URL`). Railway works similarly.

**Blockchain (testnet):** deploy the contract to Sepolia and use those values for the backend:
```bash
cd blockchain
# set RPC_URL (Alchemy/Infura) and PRIVATE_KEY in blockchain/.env
npx hardhat ignition deploy ./ignition/modules/DeployMedical.js --network sepolia
```

---

## 🔒 Security Notes

- **Secrets are never committed** — only `.env.example` files are tracked. The repo `.gitignore` excludes every `.env`.
- **Rotate any previously-exposed credentials** (Pinata keys, HuggingFace token, wallet keys) before going public.
- Passwords are bcrypt-hashed; auth uses signed JWTs; auth & report routes are rate-limited.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | — | Service health (db, chain, ML) |
| `POST` | `/api/auth/signup` | — | Create account |
| `POST` | `/api/auth/login` | — | Sign in |
| `POST` | `/api/reports/submit` | ✅ | Submit & anchor a report (multipart `report`, `patientAddress`) |
| `POST` | `/api/reports/verify` | ✅ | Verify a document against the chain |
| `POST` | `/api/reports/repudiate` | ✅ | Revoke a report (`subject`, `index`, `reason`) |
| `GET` | `/api/reports/history` | ✅ | Authenticated user's history |

---

## ⚠️ Disclaimer

The AI analysis is for demonstration and **must not** be used for real medical diagnosis.

## 📄 License

MIT
