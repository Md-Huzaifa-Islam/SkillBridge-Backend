# SkillBridge 🎓

Connect with Expert Tutors, Learn Anything

## Overview

SkillBridge is the backend for a full‑stack web application that connects learners with expert tutors. Students can browse tutor profiles, view availability, and book sessions instantly. Tutors can create and manage profiles, set availability, and track sessions. Admins oversee the platform and manage users.

**Author:** Md. Huzaifa Islam

## Roles & Permissions

- **Student**: Browse tutors, book sessions, leave reviews, manage profile
- **Tutor**: Create/update tutor profile, set availability, view bookings
- **Admin**: Manage users, bookings and categories

> Note: Users select their role at registration. Admin accounts should be seeded into the database for management tasks.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma (PostgreSQL)
- Zod for validation
- JWT for authentication

## Features

- Browse and search tutors by subject, rating and price
- Filter tutors by category
- View tutor profiles and reviews
- Student flows: register, login, book sessions, view bookings, leave reviews
- Tutor flows: register, create/update profile, set availability, view sessions
- Admin flows: view/manage users, bookings and categories

## Database (recommended tables)

- `Users` — authentication & profile info
- `TutorProfiles` — tutor-specific fields, linked to `Users`
- `Categories` — subject categories
- `Bookings` — session bookings between students and tutors
- `Reviews` — student reviews for tutors

Design fields to suit the features above (ids, relations, timestamps, status, pricing, rating, etc.).

## API Endpoints (examples)

Authentication

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET  /api/auth/me` — Current user

Tutors & Categories

- `GET  /api/tutors` — List tutors
- `GET  /api/tutors/:id` — Tutor details
- `GET  /api/categories` — List categories

Bookings

- `POST /api/bookings` — Create booking
- `GET  /api/bookings` — List user's bookings
- `GET  /api/bookings/:id` — Booking details

# SkillBridge 🎓

Connect with Expert Tutors — backend service

## Overview

SkillBridge is the backend for a tutoring marketplace that connects students and tutors. This repository contains the Express + TypeScript API, Prisma schema, and helper scripts used to run and seed the service locally.

**Author:** Md. Huzaifa Islam

## Roles & Permissions

- Student: browse tutors, book sessions, leave reviews, manage profile
- Tutor: create and manage tutor profile, set availability, view bookings
- Admin: manage users, bookings and categories (admin routes require admin role)

> Users select their role during registration. Admin accounts should be seeded.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma (PostgreSQL)
- Zod for request validation
- JWT for authentication

## Repository Structure (important folders)

- `src/` — application code
- `src/api/module/` — route modules (auth, bookings, categories, reviews, tutor(s))
- `src/Seeds/` — seed scripts (e.g. admin seed)
- `prisma/` — Prisma schema & migrations
- `generated/prisma/` — generated Prisma client
- `tests/` — integration scripts (if present)

## API Endpoints (implemented by this backend)

Base path: `/api`

Authentication

- `POST /api/auth/register` — Register a new user (body validated)
- `POST /api/auth/login` — Login and receive JWT
- `GET  /api/auth/me` — Get current authenticated user
- `POST /api/auth/verify` — Verify user email (used by registration flow)

Bookings

- `GET    /api/bookings` — Get all bookings for current user (student or tutor)
- `GET    /api/bookings/:id` — Get booking details (student or tutor)
- `POST   /api/bookings` — Create a new booking (student only)
- `PATCH  /api/bookings/:id` — Update booking status (student or tutor)

Categories

- `GET    /api/categories` — List categories
- `POST   /api/categories` — Create category (admin)
- `PATCH  /api/categories/:id` — Update category (admin)
- `DELETE /api/categories/:id` — Delete category (admin)

Reviews

- `GET    /api/reviews/:id` — Get reviews for a tutor profile (auth required)
- `POST   /api/reviews/:id` — Create a review for a tutor profile (student)
- `POST   /api/reviews` — Create a review by `bookingId` (student)
- `PATCH  /api/reviews/:id` — Update a review (student)
- `DELETE /api/reviews/:id` — Delete a review (admin or owner)

Tutor / Tutor Profiles

- `GET    /api/tutors` — List all tutors (public)
- `GET    /api/tutors/:id` — Get tutor profile details (public)
- `GET    /api/tutors/me` — Get the authenticated tutor's profile (tutor)
- `GET    /api/tutors/rating/:id` — Get ratings for a tutor (auth)
- `POST   /api/tutors` — Create tutor profile (tutor)
- `PATCH  /api/tutors/me` — Update own tutor profile (tutor)
- `PATCH  /api/tutors/active/me` — Activate/deactivate own profile (tutor)
- `PATCH  /api/tutors/slot/:id` — Update availability slot for tutor (tutor)

Tutor (single-tutor module)

- `PUT`/`PATCH` or other admin-specific tutor routes may exist under `/api/tutor` (see `src/api/index.ts`) depending on enabled modules.

## Database (Prisma) — Key models

This project uses Prisma. Main models defined in `prisma/schema.prisma` include:

- `User` — id, name, email, password, role (admin|student|tutor), status
- `Verification` — email verification tokens
- `Category` — subject categories
- `TutorProfile` — tutor details linked to `User` and `Category` (title, description, price, start/end times)
- `Available` — weekly availability slots for tutors
- `Booking` — bookings between students and tutors (status: CONFIRMED/COMPLETED/CANCELLED)
- `Review` — reviews linked to a booking

Refer to `prisma/schema.prisma` for exact fields and relations.

## Local Setup

1. Install prerequisites: Node.js (>= 18), PostgreSQL, and `pnpm` or `npm`.
2. Set environment variables (example):

```
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge
JWT_SECRET=your_jwt_secret
PORT=5000
# Optional: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS for email
```

3. Install dependencies:

```bash
pnpm install
# or
npm install
```

4. Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. (Optional) Seed admin user:

```bash
pnpm run seed-admin
# or
node ./src/Seeds/seed.ts
```

6. Start server in development:

```bash
pnpm run dev
# or
npx tsx ./src/server.ts
```

## Scripts

Main scripts available in `package.json`:

- `pnpm run dev` — run server in watch mode
- `pnpm run build` — generate prisma client and build
- `pnpm run start` — run the built server
- `pnpm run seed-admin` — run seed script for admin

## Environment variables

The backend reads configuration from environment variables. Create a `.env` file (you can copy `.env.example`) and set the values appropriate for your environment.

Key variables:

- `DATABASE_URL` — Postgres connection string (example: `postgresql://user:pass@localhost:5432/skillbridge`).
- `JWT_SECRET` — JWT signing secret used for authentication tokens.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` — SMTP settings used to send verification or notification emails.
- `APP_URL` — The frontend application's base URL (for example `http://localhost:3000`). This is the URL the backend uses when composing links (verification, redirects) intended for your frontend.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — Optional initial admin credentials used by seed scripts (only for local/dev use).
- `PORT` — Port where the backend server runs (default `5000`).

See `.env.example` for a safe template of these keys.

## License

This repository is licensed under the MIT License — see `LICENSE`.
