# Digital Wallet API

An Express.js + MongoDB backend for a role-based digital wallet system (Bkash/Nagad style).

## Features

- JWT authentication with user/agent/admin roles
- Wallet auto-created on registration
- Core operations: add money, withdraw, send money, agent cash-in/out, admin control
- Transaction history for all roles
- Wallet lock/unlock, agent approval
- Modular repo, strong validations and error-handling

## Folder Structure

See `src/` folder for modules:
- auth, user, agent, admin, wallet, transaction, middlewares, utils

## Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET  /api/wallet/me
- POST /api/wallet/add, /withdraw, /send
- GET  /api/wallet/transactions
- POST /api/agent/cash-in, /cash-out
- GET  /api/agent/commission
- Admin: GET /api/admin/users, /wallets, /transactions
- Admin: PATCH /api/admin/wallets/block/:id, /unblock/:id
- Admin: PATCH /api/admin/agents/approve/:id, /suspend/:id

## Setup

1. Copy .env file, set `JWT_SECRET`, `MONGO_URI`.
2. npm install
3. npm run dev
4. Test endpoints using Postman.

---

**Thanks!**
