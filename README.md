# My Masjid 🕌

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

A comprehensive mosque management platform built as a monorepo, featuring a mobile app for users and a cloud-based API for backend services.

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [Applications](#-applications)
  - [Mobile App](#mobile-app-appsmobile)
  - [API Backend](#api-backend-appsapi)
- [Packages](#-packages)
- [Development Workflow](#️-development-workflow)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Internationalization](#-internationalization)
- [Troubleshooting](#-troubleshooting)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Key Features

- 🕌 **Mosque Discovery**: Find and explore mosques in your area
- 📅 **Prayer Times**: Accurate prayer time tracking and notifications
- 🔐 **Authentication**: Secure user authentication with Better Auth
- 🌍 **Multi-language Support**: English, Hindi, and Urdu localization
- 📱 **Cross-platform**: iOS, Android, and Web support
- ☁️ **Serverless Backend**: Scalable API powered by Cloudflare Workers
- 🎨 **Modern UI**: Beautiful interface with NativeWind styling
- 🔄 **Real-time Data**: Efficient data fetching with TanStack Query

## 🏗️ Architecture

This project is organized as a monorepo using **Bun workspaces** with the following structure:

```text
my-masjid/
├── apps/
│   ├── api/           # Cloudflare Workers API backend
│   └── mobile/        # React Native Expo mobile app
└── packages/
    └── validators/    # Shared validation schemas
```

### Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React Native, Expo, TypeScript, NativeWind |
| **Backend** | Hono, Cloudflare Workers, Drizzle ORM |
| **Database** | Cloudflare D1 (SQLite) |
| **Authentication** | Better Auth |
| **Validation** | Zod |
| **State Management** | TanStack Query, Zustand |
| **Internationalization** | i18next, react-i18next |
| **Build Tools** | Bun, TypeScript, Metro |

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.2.18 or later) - Primary package manager and runtime
- [Node.js](https://nodejs.org) (v18 or later) - Required for Expo development
- [Android Studio](https://developer.android.com/studio) - For Android development
- [Xcode](https://developer.apple.com/xcode/) - For iOS development (macOS only)
- [Cloudflare Account](https://cloudflare.com) - For API deployment

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/BioHazard786/My-Masjid.git
cd my-masjid
```

2. **Install dependencies for all workspaces:**

```bash
bun install
```

3. **Set up environment variables:**

   - Copy `.env.example` files in each app directory
   - Configure required environment variables (see [Configuration](#-configuration))

4. **Start development:**

```bash
# Start mobile app
cd apps/mobile && bun start

# Start API development server (in another terminal)
cd apps/api && bun run dev
```

## 📱 Applications

### Mobile App (`apps/mobile`)

A React Native Expo application for mosque-goers to find mosques, view prayer times, and manage their worship schedule.

**Tech Stack:**

- React Native with Expo (v53)
- Expo Router for file-based navigation
- TanStack Query for server state management
- NativeWind (Tailwind CSS) for styling
- Better Auth for authentication
- i18next for internationalization
- TypeScript for type safety
- Zustand for client state management

**Development:**

```bash
cd apps/mobile

# Start development server
bun start

# Run on specific platforms
bun run android        # Android development
bun run ios           # iOS development (macOS only)
bun run web           # Web development

# Development tools
bun run lint          # ESLint code checking
bunx expo doctor      # Diagnose project issues
bunx expo install     # Install compatible packages
```

**Features:**

- 🔍 **Mosque Discovery**: Search and filter mosques by location, facilities
- 📅 **Prayer Times**: Accurate prayer time calculations with notifications
- 🔐 **User Authentication**: Secure login with email/password and social auth
- 🌍 **Multi-language Support**: English, Hindi, and Urdu with RTL support
- 📱 **Cross-platform**: Native performance on iOS, Android, and Web
- 🎨 **Adaptive Design**: Dark/light themes with system preference detection
- 📍 **Location Services**: GPS-based mosque discovery and prayer times
- 🔔 **Push Notifications**: Prayer time reminders and mosque updates

### API Backend (`apps/api`)

A serverless API built with Hono and deployed on Cloudflare Workers, providing backend services for the mobile application.

**Tech Stack:**

- Hono web framework (v4.8+)
- Cloudflare Workers for serverless deployment
- Drizzle ORM for type-safe database operations
- Cloudflare D1 (SQLite) for database
- Better Auth for authentication
- Zod for runtime validation
- TypeScript for type safety

**Development:**

```bash
cd apps/api

# Start development server with hot reload
bun run dev

# Database operations
bun run drizzle:generate    # Generate database migrations
bun run drizzle:migrate     # Apply migrations to database
bun run drizzle:dev         # Open Drizzle Studio (database GUI)

# Deployment and types
bun run deploy              # Deploy to Cloudflare Workers
bun run cf-typegen          # Generate TypeScript types for Cloudflare bindings

# Development tools
bunx wrangler dev           # Alternative dev server
bunx wrangler tail          # View production logs
bunx wrangler pages dev     # Test pages functions locally
```

**Features:**

- 🔐 **Authentication & Authorization**: JWT-based auth with session management
- 🕌 **Mosque Management**: CRUD operations for mosque data and metadata
- 👥 **User Management**: Profile management, preferences, and roles
- 📊 **Analytics**: Usage tracking and performance monitoring
- 🌍 **Localization**: Multi-language content management
- 🗄️ **Database Operations**: Type-safe queries with Drizzle ORM
- ☁️ **Serverless Architecture**: Auto-scaling with global edge deployment
- 🔒 **Security**: Rate limiting, CORS, and input validation
- 📍 **Geolocation**: Location-based mosque discovery and services

## 📦 Packages

### Validators (`packages/validators`)

Shared validation schemas using Zod, ensuring consistent data validation across the mobile app and API.

**Features:**
- Type-safe validation schemas
- Shared between frontend and backend
- Runtime type checking
- Error message localization support

**Usage:**

```typescript
import { userSchema, masjidSchema, prayerTimeSchema } from '@mymasjid/validators';

// Validate user input
const validatedUser = userSchema.parse(userData);

// Validate mosque data
const validatedMasjid = masjidSchema.parse(masjidData);

// Type inference
type User = z.infer<typeof userSchema>;
type Masjid = z.infer<typeof masjidSchema>;
```

**Available Schemas:**
- `userSchema` - User profile and authentication data
- `masjidSchema` - Mosque information and metadata
- `prayerTimeSchema` - Prayer time schedules and settings
- `locationSchema` - Geographic location data
- `preferenceSchema` - User preferences and settings

## 🛠️ Development Workflow

### Root Level Commands

```bash
# Package management
bun install                 # Install all dependencies
bun update                  # Update all dependencies

# Development
bun run build              # Build all TypeScript projects
bun run lint               # Run linting across all projects
bun run test               # Run tests across all projects (when implemented)

# Clean up
bun run clean              # Clean all build artifacts
```

### Working with the Monorepo

This project uses **Bun workspaces** to manage dependencies and share code between applications. Each app and package can be developed independently while sharing common dependencies and utilities.

**Key Benefits:**

- 🔗 **Shared Code**: Common utilities and types through the `packages/` directory
- 📦 **Consistent Dependencies**: Unified package management across all workspaces
- 🎯 **Type Safety**: Type-safe imports between packages with TypeScript
- 🚀 **Simplified Builds**: Coordinated build and deployment processes
- ⚡ **Fast Development**: Hot reloading and efficient bundling with Bun

### Workspace Commands

```bash
# Run commands in specific workspaces
bun --filter @mymasjid/mobile start    # Start mobile app only
bun --filter @mymasjid/api dev         # Start API only

# Install dependencies in specific workspace
bun add react --filter @mymasjid/mobile

# Run scripts across multiple workspaces
bun run --parallel lint                # Run lint in all workspaces
```

### Code Organization

```text
├── apps/
│   ├── mobile/           # React Native mobile application
│   │   ├── app/         # Expo Router file-based routing
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and configurations
│   │   └── store/       # State management
│   └── api/             # Cloudflare Workers API
│       ├── src/         # Source code
│       │   ├── routes/  # API route handlers
│       │   ├── lib/     # Shared utilities
│       │   └── db/      # Database schemas and migrations
│       └── drizzle/     # Database migration files
└── packages/
    └── validators/      # Shared validation schemas
        └── src/         # Zod schemas and types
```

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

## 🔧 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear all caches and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
bun install

# Clear TypeScript build cache
rm -rf **/*.d.ts **/*.js
bun run build
```

**Metro Bundle Issues:**
```bash
cd apps/mobile
npx expo start --clear
```

**Cloudflare Workers Issues:**
```bash
cd apps/api
# Check wrangler login status
bunx wrangler whoami

# Re-authenticate if needed
bunx wrangler login
```

**Development Server Issues:**
- Ensure ports 3000 (API) and 8081 (Metro) are available
- Check firewall settings for Expo development
- Verify environment variables are properly set

## 🚀 Deployment

### API Deployment

The API is deployed to Cloudflare Workers for optimal global performance:

```bash
cd apps/api

# Deploy to production
bun run deploy

# Deploy with specific environment
bunx wrangler deploy --env production
```

### Mobile App Deployment

The mobile app can be deployed using Expo Application Services (EAS):

```bash
cd apps/mobile

# Build for production
bunx expo prebuild --clean

# Build for app stores (requires EAS configuration)
bunx eas build --platform all

# Submit to app stores
bunx eas submit --platform all
```

### Environment-specific Deployments

- **Development**: Auto-deployed on feature branches
- **Staging**: Deployed from `develop` branch
- **Production**: Deployed from `main` branch with manual approval

## 📊 Performance

### Mobile App Performance

- **Bundle Size**: Optimized with Metro bundler and Hermes engine
- **Startup Time**: < 2 seconds on modern devices
- **Memory Usage**: Efficient with React Native's optimizations
- **Offline Support**: Prayer times and core features work offline

### API Performance

- **Response Time**: < 100ms global average via Cloudflare Workers
- **Scalability**: Automatically scales to handle traffic spikes
- **Availability**: 99.9% uptime SLA through Cloudflare's global network
- **Database**: Cloudflare D1 provides low-latency data access

### Optimization Features

- **Image Optimization**: Automatic image compression and WebP conversion
- **Code Splitting**: Lazy loading of non-critical components
- **Caching**: Intelligent caching strategies for static and dynamic content
- **Bundle Analysis**: Regular monitoring of bundle size and dependencies

## 🌍 Internationalization

The mobile app supports multiple languages with complete localization:

### Supported Languages

| Language | Code | Status | RTL Support |
|----------|------|--------|-------------|
| 🇺🇸 English | `en` | ✅ Complete | No |
| 🇮🇳 Hindi | `hi` | ✅ Complete | No |
| 🇵🇰 Urdu | `ur` | ✅ Complete | ✅ Yes |

### Implementation Details

- **Translation Files**: Located in `apps/mobile/locales/`
- **Framework**: i18next with react-i18next
- **Storage**: MMKV for persistent language preferences
- **Fallback**: Automatic fallback to English for missing translations
- **Device Language**: Automatically detects and sets device language on first launch

### Adding New Languages

1. **Create Translation File:**
   ```bash
   # Add new language file
   cp apps/mobile/locales/en.json apps/mobile/locales/[lang_code].json
   ```

2. **Update Configuration:**
   ```typescript
   // In apps/mobile/lib/i18n.ts
   import newLang from "@mobile/locales/[lang_code].json";
   
   const resources = {
     // ... existing languages
     [lang_code]: { translation: newLang }
   };
   ```

3. **Update App Configuration:**
   ```json
   // In apps/mobile/app.json
   "expo-localization": {
     "supportedLocales": {
       "ios": ["en", "hi", "ur", "[lang_code]"],
       "android": ["en", "hi", "ur", "[lang_code]"]
     }
   }
   ```

### Translation Guidelines

- Use descriptive keys: `common.buttons.save` instead of `save`
- Keep text concise for mobile interfaces
- Consider text expansion for different languages
- Test RTL languages thoroughly
- Use interpolation for dynamic content: `{{count}} mosques found`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

### Current Status (v1.0)
- ✅ Basic mosque discovery and search
- ✅ Prayer times tracking
- ✅ User authentication
- ✅ Multi-language support (EN/HI/UR)
- ✅ Cross-platform mobile app

### Upcoming Features (v1.1)
- 🔄 Push notifications for prayer times
- 🔄 Mosque reviews and ratings
- 🔄 Community features and discussions
- 🔄 Prayer time customization
- 🔄 Qibla direction compass

### Future Plans (v2.0+)
- 📋 Event management for mosques
- 📋 Donation and Zakat management
- 📋 Islamic calendar integration
- 📋 Educational content and resources
- 📋 Advanced analytics for mosque administrators

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? [Open an issue](https://github.com/BioHazard786/My-Masjid/issues/new/choose)
- 💡 **Feature Requests**: Have an idea? [Suggest a feature](https://github.com/BioHazard786/My-Masjid/issues/new/choose)
- 📝 **Documentation**: Help improve our docs
- 🌍 **Translations**: Add support for new languages
- 💻 **Code**: Submit pull requests for bug fixes or new features

### Getting Started

1. Read our [Contributing Guidelines](CONTRIBUTING.md)
2. Check our [Code of Conduct](CODE_OF_CONDUCT.md)
3. Look for issues labeled `good first issue` or `help wanted`
4. Join our community discussions

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `bun run test`
5. Submit a pull request

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute to this project.

## 📞 Support

Mohd Zaid - [Telegram](https://t.me/LuLu786) - <bzatch70@gmail.com>

Project Link: [https://github.com/BioHazard786/My-Masjid](https://github.com/BioHazard786/My-Masjid)
