# SkillBridge Backend API 🎓

**"Connect with Expert Tutors, Learn Anything"**

A robust Node.js backend API for the SkillBridge platform that connects learners with expert tutors.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better-Auth
- **Email**: Nodemailer
- **Package Manager**: pnpm

## ✨ Features

### Authentication & Authorization

- User registration with role selection (Student/Tutor/Admin)
- JWT-based authentication
- Email verification
- Role-based access control

### Student Features

- Browse and search tutors
- Filter by category, rating, and price
- Book tutoring sessions
- View booking history
- Leave reviews after sessions

### Tutor Features

- Create and manage tutor profile
- Set availability slots
- View teaching sessions
- Track ratings and reviews

### Admin Features

- User management (ban/unban)
- View all bookings
- Manage categories
- Platform analytics

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- pnpm

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run database migrations**

```bash
pnpm prisma migrate dev
```

5. **Seed the database (optional)**

```bash
pnpm prisma db seed
```

6. **Start development server**

```bash
pnpm dev
```

The server will start at `http://localhost:3000`

## 🔐 Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `APP_URL` - Frontend application URL
- `BETTER_AUTH_SECRET` - Secret key for authentication
- `BETTER_AUTH_URL` - Backend URL for auth callbacks
- Email configuration (SMTP settings)

## 🗄️ Database Schema

### Core Tables

- **Users** - User accounts and authentication
- **TutorProfiles** - Tutor-specific information
- **Categories** - Subject categories
- **Bookings** - Session bookings
- **Ratings** - Student reviews
- **Available** - Tutor availability slots

### User Roles

- `STUDENT` - Learners who book sessions
- `TUTOR` - Experts who offer tutoring
- `ADMIN` - Platform moderators

### Booking Status Flow

```
CONFIRM → COMPLETED
        → CANCELLED
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Tutors (Public)

```
GET    /api/tutors           - Get all tutors (with filters)
GET    /api/tutors/:id       - Get tutor details
```

### Categories

```
GET    /api/categories       - Get all categories
```

### Bookings

```
POST   /api/bookings         - Create new booking
GET    /api/bookings         - Get user's bookings
GET    /api/bookings/:id     - Get booking details
```

### Tutor Management (Protected)

```
PUT    /api/tutor/profile    - Update tutor profile
PUT    /api/tutor/availability - Update availability
GET    /api/tutor/sessions   - View teaching sessions
```

### Reviews

```
POST   /api/reviews          - Create review
GET    /api/reviews          - Get reviews
```

### Admin (Protected)

```
GET    /api/admin/users      - Get all users
PATCH  /api/admin/users/:id  - Update user status
GET    /api/admin/bookings   - Get all bookings
POST   /api/admin/categories - Create category
PUT    /api/admin/categories/:id - Update category
DELETE /api/admin/categories/:id - Delete category
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── tutors/       # Public tutor endpoints
│   │   ├── tutor/        # Protected tutor endpoints
│   │   ├── bookings/     # Booking management
│   │   ├── reviews/      # Reviews
│   │   ├── categories/   # Categories
│   │   └── admin/        # Admin endpoints
│   ├── config/           # Configuration
│   ├── lib/              # Utilities (auth, prisma, email)
│   ├── middleware/       # Express middleware
│   ├── prisma/           # Database schema & migrations
│   ├── types/            # TypeScript types
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Development

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma studio` - Open Prisma Studio
- `pnpm prisma migrate dev` - Run migrations

### Code Style

- TypeScript for type safety
- ESM modules
- Async/await for asynchronous operations
- RESTful API design principles

## 📝 License

ISC

## 👥 Contributors

Programming Hero - Assignment 04

---

Built with ❤️ for SkillBridge Platform
