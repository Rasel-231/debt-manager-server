# Debt Manager Server

RESTful API for debt and loan management with role-based access control, JWT authentication, and Redis-powered token management.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma 7 (PostgreSQL adapter)
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh tokens) via httpOnly cookies
- **Cache:** Redis (with in-memory fallback)
- **Validation:** Zod

## Features

- Register / Login / Logout with secure httpOnly cookies
- Access token (1h) + Refresh token (30d) rotation
- RBAC — `USER` and `ADMIN` roles with route-level and ownership-level guards
- Full CRUD for Loans and Transactions
- Loan summary with status breakdown, type breakdown, monthly trend, critical/finished/new loan lists
- Transaction stats with recent activity
- Pagination, sorting, and filtering on all list endpoints
- Redis token blacklisting with fallback to in-memory store

## Project Structure

```
src/
├── app.ts                     # Express app setup
├── server.ts                  # Bootstrap (Redis + listen)
├── config/
│   └── index.ts               # Environment config
├── errors/
│   └── ApiError.ts            # Custom error class
├── interfaces/
│   └── common.ts              # Shared TS interfaces
├── middlewares/
│   ├── auth.ts                # authenticate + authorize
│   ├── globalErrorHandler.ts  # Centralized error handler
│   └── validateRequest.ts     # Zod validation middleware
├── shared/
│   ├── prisma.ts              # PrismaClient singleton
│   ├── redis.ts               # Redis client
│   ├── tokenStore.ts          # Token store (Redis + memory)
│   └── paginationHelper.ts    # Pagination calculator
├── utils/
│   ├── catchAsync.ts          # Async error wrapper
│   ├── jwtCookie.ts           # Cookie helpers
│   ├── pick.ts                # Object pick utility
│   └── sendResponse.ts        # Standardized JSON response
└── app/
    ├── prisma/                 # Multi-file Prisma schema
    │   ├── schema.prisma       # Generator + datasource
    │   ├── enums.prisma        # Role, LoanType, LoanStatus, TransactionType
    │   ├── user.prisma         # User model
    │   ├── loan.prisma         # Loan model
    │   └── transaction.prisma  # Transaction model
    ├── routes/
    │   └── index.ts            # Route aggregator
    └── modules/
        ├── auth/               # Register, Login, Logout, Refresh, Profile, Change Password
        ├── user/               # CRUD (Admin only)
        ├── loan/               # CRUD + Summary
        └── transaction/        # CRUD + Stats
```

Each module follows the same structure:

```
modules/<name>/
├── <name>.constant.ts      # Filterable/sortable field arrays
├── <name>.controller.ts    # Request handlers (wrapped in catchAsync)
├── <name>.interface.ts     # TypeScript interfaces
├── <name>.route.ts         # Express Router
├── <name>.service.ts       # Business logic + Prisma queries
└── <name>.validation.ts    # Zod schemas
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Redis (optional — falls back to in-memory)

### Install

```bash
npm install
```

### Environment

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5001/api/v1
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/debt_manager_db?schema=public"
SALT_ROUND=10
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
COOKIE_SECURE=false
REDIS_URL=redis://localhost:6379
```

### Database

```bash
npx prisma generate
npx prisma db push
```

### Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server starts at `http://localhost:5001`.

## API Endpoints

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login (sets cookies) |
| POST | `/auth/logout` | Yes | Logout (clears cookies) |
| POST | `/auth/refresh` | No | Refresh access token |
| GET | `/auth/me` | Yes | Get current user profile |
| POST | `/auth/change-password` | Yes | Change password |

### Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Loans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/loans/summary` | Loan summary + analytics |
| GET | `/loans` | List loans (paginated) |
| POST | `/loans` | Create loan |
| GET | `/loans/:id` | Get loan detail |
| PATCH | `/loans/:id` | Update loan |
| DELETE | `/loans/:id` | Delete loan |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions/stats` | Transaction stats |
| GET | `/transactions` | List transactions (paginated) |
| POST | `/transactions` | Record transaction |
| GET | `/transactions/:id` | Get transaction detail |
| PATCH | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

## Data Models

### Roles

- `USER` — Can manage own loans and transactions
- `ADMIN` — Full access to all data + user management

### Loan Types

- `CASH_WITH_PRODUCT` — Cash loan with product collateral
- `CASH_ONLY` — Pure cash loan

### Loan Status

- `PENDING` — Not yet active
- `ACTIVE` — Currently active
- `DUE` — Overdue
- `FINISHED` — Fully paid

### Transaction Types

- `PAYMENT` — Payment towards a loan
- `DEPOSIT` — Deposit into a loan

## License

MIT
