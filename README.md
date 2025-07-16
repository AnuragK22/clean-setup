This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Uni-Sys

A modern TypeScript-based web application built with Next.js and best practices.

## 📦 Tech Stack

### Core Frameworks & Libraries

- **Next.js 15.3** - React framework for production
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Static type checking for JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Fast, disk space efficient package manager

### State Management & Data Handling

- **TanStack Query (React Query)** - Data fetching, caching, and synchronization
- **Zustand** - State management for React
- **Axios** - Promise-based HTTP client
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation
- **Qs** - Query string parsing and stringifying

### UI Components & Styling

- **Radix UI** - Accessible, unstyled UI components
- **Shadcn UI** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library
- **Tailwind Merge** - Utility for merging Tailwind classes
- **Tailwind CSS** - Utility-first CSS framework
- **Next Themes** - Theme switching for Next.js

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Commitlint** - Commit message linting
- **Commitizen** - Standardized commit messages
- **Lint-Staged** - Run linters on git staged files
- **Semantic Release** - Automated version management

### Additional Utilities

- **React Hot Toast** - Toast notifications
- **Date-fns** - Modern JavaScript date utility library
- **Next Auth** - Authentication solution for Next.js
- **JS Cookie** - Cookie management
- **Recharts** - React charting library
- **React Resizable Panels** - Resizable layout components

## 📁 Project Structure

```
├── /app/                    # Next.js App Router pages and layouts
├── /components/            # Reusable UI components
├── /components.json        # Component configuration
├── /hooks/                # Custom React hooks
├── /interface/            # TypeScript interfaces and types
├── /lib/                  # Utility functions and configurations
├── /providers/            # Context providers
├── /public/               # Static assets
├── /src/                  # Source files
├── /utils/                # Helper utilities
├── /api/                  # API routes
└── /apiService/           # API service layer
```

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development server:

   ```bash
   pnpm dev
   ```

3. Build for production:

   ```bash
   pnpm build
   ```

4. Start production server:
   ```bash
   pnpm start
   ```

## 🛠️ Development Tools

- **Linting**: `pnpm lint`
- **Formatting**: `pnpm format`
- **Commit**: `pnpm commit`

## 📝 Code Style & Standards

- Follow the Airbnb JavaScript Style Guide
- Use TypeScript with strict mode
- PascalCase for component and file names
- Feature-based folder structure
- ESLint, Prettier, and TypeScript strict configurations
- Absolute imports using `tsconfig.json` paths
- Immutable patterns and functional programming

## 🎨 Styling & UI

- Use Tailwind CSS for all styling
- Leverage Shadcn UI components
- Avoid custom CSS/SCSS
- Use design tokens for consistent theming
- Create reusable components under `components/ui/`
- Use Headless UI patterns for accessible components

## 🔐 Security & Authentication

- Use Next Auth for authentication
- Implement proper cookie management
- Follow secure coding practices
- Use environment variables for sensitive data

## 📈 Data Fetching & State

- Use TanStack Query for data fetching
- Implement proper error boundaries
- Use Zustand for local/global state
- Prefer computed/derived state via selectors
- Keep store logic lean and focused

## 📚 Documentation

- Document complex logic with inline comments
- Maintain up-to-date README.md
- Follow semantic versioning
- Use conventional commits
- Document API endpoints and data structures
