# My Masjid 🕌

A comprehensive mosque management platform built as a monorepo, featuring a mobile app for users and a cloud-based API for backend services.

## 🏗️ Architecture

This project is organized as a monorepo using Bun workspaces with the following structure:

```text
my-masjid/
├── apps/
│   ├── api/           # Cloudflare Workers API backend
│   └── mobile/        # React Native Expo mobile app
└── packages/
    └── validators/    # Shared validation schemas
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.2.18 or later)
- [Node.js](https://nodejs.org) (for Expo development)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/BioHazard786/My-Masjid.git
cd my-masjid
```

1. Install dependencies for all workspaces:

```bash
bun install
```

## 📱 Applications

### Mobile App (`apps/mobile`)

A React Native Expo application for mosque-goers to find mosques, view prayer times, and manage their worship schedule.

**Tech Stack:**

- React Native with Expo
- Expo Router for navigation
- TanStack Query for data fetching
- NativeWind for styling
- Better Auth for authentication
- TypeScript

**Development:**

```bash
cd apps/mobile

# Start development server
bun start

# Run on Android
bun run android

# Run on iOS
bun run ios

# Run on web
bun run web

# Lint code
bun run lint
```

**Features:**

- 🔍 Mosque search and discovery
- 📅 Prayer time tracking
- 🔐 User authentication
- 🌍 Multi-language support (English, Hindi, Urdu)
- 📱 Cross-platform (iOS, Android, Web)

### API Backend (`apps/api`)

A serverless API built with Hono and deployed on Cloudflare Workers, providing backend services for the mobile application.

**Tech Stack:**

- Hono web framework
- Cloudflare Workers for serverless deployment
- Drizzle ORM for database operations
- Better Auth for authentication
- Zod for validation
- TypeScript

**Development:**

```bash
cd apps/api

# Start development server
bun run dev

# Deploy to Cloudflare Workers
bun run deploy

# Generate database migrations
bun run drizzle:generate

# Run database migrations
bun run drizzle:migrate

# Open Drizzle Studio
bun run drizzle:dev

# Generate TypeScript types for Cloudflare bindings
bun run cf-typegen
```

**Features:**

- 🔐 Authentication and user management
- 🕌 Mosque data management
- 🗄️ Database operations with Drizzle ORM
- ☁️ Serverless deployment on Cloudflare Workers

## 📦 Packages

### Validators (`packages/validators`)

Shared validation schemas using Zod, ensuring consistent data validation across the mobile app and API.

**Usage:**

```typescript
import { userSchema, masjidSchema } from '@mymasjid/validators';
```

## 🛠️ Development Workflow

### Root Level Commands

```bash
# Install all dependencies
bun install

# Build all TypeScript projects
bun run build

# Run linting across all projects
bun run lint

# Run tests across all projects
bun run test
```

### Working with the Monorepo

This project uses Bun workspaces to manage dependencies and share code between applications. Each app and package can be developed independently while sharing common dependencies and utilities.

**Key Benefits:**

- Shared code through the `packages/` directory
- Consistent dependency management
- Type-safe imports between packages
- Simplified build and deployment processes

## 🔧 Configuration

### Environment Variables

Each application requires specific environment variables:

**API (`apps/api`):**

- Configure in `wrangler.jsonc` for Cloudflare Workers
- Database connection strings
- Authentication secrets

**Mobile (`apps/mobile`):**

- Configure in `app.json` for Expo
- API endpoints
- Authentication configuration

### Database

The API uses Drizzle ORM with the following commands:

```bash
cd apps/api

# Generate new migration
bun run drizzle:generate

# Apply migrations
bun run drizzle:migrate

# Open database studio
bun run drizzle:dev
```

## 🚀 Deployment

### API Deployment

The API is deployed to Cloudflare Workers:

```bash
cd apps/api
bun run deploy
```

### Mobile App Deployment

The mobile app can be deployed using Expo Application Services (EAS):

```bash
cd apps/mobile

# Build for production
bunx expo prebuild --clean

# Build and submit to app stores (requires EAS configuration)
eas build --platform all
eas submit --platform all
```

## 🌍 Internationalization

The mobile app supports multiple languages:

- English (en)
- Hindi (hi)
- Urdu (ur)

Translation files are located in `apps/mobile/locales/`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute to this project.

## 📞 Support

Mohd Zaid - [Telegram](https://t.me/LuLu786) - <bzatch70@gmail.com>

Project Link: [https://github.com/BioHazard786/My-Masjid](https://github.com/BioHazard786/My-Masjid)
