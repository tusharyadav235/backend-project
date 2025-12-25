# Raja Cattle Feed - E-commerce Platform

## Overview

Raja Cattle Feed is a full-stack e-commerce application for selling cattle feed products. The platform features a React frontend with a rustic/natural design theme, Express.js backend API, PostgreSQL database with Drizzle ORM, and integrates Razorpay for payment processing. The application supports customer accounts, shopping cart functionality, order management, and an admin dashboard for product management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React Context for auth and cart
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom natural/rustic color palette (dark green primary, cream background, earthy brown accent)
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy, express-session for session management
- **Database**: PostgreSQL with Drizzle ORM
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schemas for type-safe request/response validation
- **Session Storage**: MemoryStore (development) - should use connect-pg-simple for production

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (shared between frontend and backend)
- **Tables**: users, products, orders, orderItems, contactMessages
- **Migrations**: Generated to ./migrations directory via drizzle-kit

### Key Design Patterns
- **Shared Types**: Schema and route definitions in /shared folder for full-stack type safety
- **Storage Abstraction**: IStorage interface in server/storage.ts allows swapping implementations
- **API Client**: Centralized query client with custom fetch wrapper in client/src/lib/queryClient.ts
- **Component Architecture**: Presentational components in ui/, feature components in components/, pages in pages/

### Build System
- **Development**: tsx runs server/index.ts with Vite dev server middleware
- **Production**: Custom build script using esbuild for server, Vite for client
- **Output**: dist/index.cjs (server bundle), dist/public (static assets)

## External Dependencies

### Payment Processing
- **Razorpay**: Indian payment gateway for processing orders (requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables)

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations and schema push via `npm run db:push`

### Authentication
- **Passport.js**: Authentication middleware with local strategy
- **Express Session**: Session management (requires SESSION_SECRET environment variable for production)

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, toast, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **React Day Picker**: Calendar component

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner for enhanced Replit development experience