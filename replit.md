# SecondChance Dating App

## Overview

SecondChance is a modern dating application built with a full-stack TypeScript architecture. The application features a mobile-first design with swipe-based user discovery, real-time messaging, and comprehensive user matching capabilities. It's designed as a single-page application with a REST API backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful API with JSON responses
- **Development**: Hot reload with Vite middleware integration

### Mobile-First Design
- Responsive design optimized for mobile devices
- Native-like interface with bottom navigation
- Touch-friendly interactions and swipe gestures
- Progressive Web App capabilities

## Key Components

### User Management
- User registration and authentication
- Profile creation and management
- Photo upload and verification system
- Privacy settings and visibility controls

### Discovery System
- Card-based user discovery interface
- Swipe interactions (like, super like, pass)
- Geographic and preference-based filtering
- Real-time match detection

### Matching Engine
- Mutual like detection creates matches
- Match notification system
- Match history and statistics tracking

### Messaging System
- Real-time chat between matched users
- Message history persistence
- Read status tracking
- Recent conversations overview

### Safety Features
- User verification system
- Safety guidelines and reporting
- Privacy controls
- Content moderation capabilities

## Data Flow

### User Discovery Flow
1. User requests discovery users from `/api/discover/:userId`
2. Backend filters users based on preferences and existing interactions
3. Frontend displays users in swipeable card interface
4. User actions (like/pass) sent to `/api/likes`
5. Backend checks for mutual likes and creates matches
6. Match notifications displayed to users

### Messaging Flow
1. Users access chat through `/chat/:matchId` route
2. Messages fetched from `/api/messages/match/:matchId`
3. New messages sent via POST to `/api/messages`
4. Real-time updates through query invalidation
5. Message history maintained in database

### Profile Management
1. User profiles stored with visibility settings
2. Stats tracked for profile views, matches, response rates
3. Privacy settings control data visibility
4. Profile updates synchronized across all views

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **zod**: Schema validation

### Backend Dependencies
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **express**: Web application framework
- **zod**: Runtime type validation
- **tsx**: TypeScript execution for development

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **tailwindcss**: CSS preprocessing
- **drizzle-kit**: Database migration tools

## Deployment Strategy

### Build Process
- Frontend built with Vite to static assets in `dist/public`
- Backend compiled with esbuild to `dist/index.js`
- Single deployment artifact with embedded static serving

### Database Management
- PostgreSQL database hosted on Neon (serverless)
- Schema managed through Drizzle migrations
- Connection string via `DATABASE_URL` environment variable

### Production Setup
- Express server serves both API routes and static frontend
- Static assets served from `/dist/public`
- API routes prefixed with `/api`
- Environment-based configuration

### Development Workflow
- Concurrent frontend/backend development with Vite middleware
- Hot reload for both client and server code
- Shared TypeScript types between frontend and backend
- Database schema shared across application layers

The application uses a monorepo structure with shared types and utilities, enabling type safety across the full stack while maintaining clear separation between client and server concerns.