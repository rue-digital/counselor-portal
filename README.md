# DARN Counselor Portal

This is the source code for the DARN counselor portal.

## Getting Started

### Prerequisites

- Install Bun

### Installation

1. Clone the repository:

   ```bash

   ```

2. Install bun. Then install dependencies:

   ```bash
   bun install
   ```

3. Connect to supabase:

   Use `.env.example` to setup `.env` file locally. Look under settings/environments/dev in the Github browser for the environment variables and add to your `.env` file.

4. Start the development server:

   ```bash
   bun dev
   ```

5. Open localhost with your browser to see the result.

# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File                     | URL                                                     |
| ------------------------ | ------------------------------------------------------- |
| `index.tsx`              | `/`                                                     |
| `about.tsx`              | `/about`                                                |
| `users/index.tsx`        | `/users`                                                |
| `users/$id.tsx`          | `/users/:id` (dynamic — bare `$`, no curly braces)      |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment)                  |
| `files/$.tsx`            | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx`            | layout route (renders children via `<Outlet />`)        |
| `__root.tsx`             | app shell — wraps every page; preserve `<Outlet />`     |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
