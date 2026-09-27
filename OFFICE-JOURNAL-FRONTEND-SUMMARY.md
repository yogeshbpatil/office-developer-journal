# OFFICE JOURNAL FRONTEND SUMMARY

Repository analyzed: `D:/Personal/Office Dialy General Task/Front-End/office-developer-journal`

Scope note:
- This is a Next.js frontend project, not a full-stack solution.
- The repository contains source code, static assets, and documentation files.
- Generated build artifacts such as `.next/` and install artifacts such as `node_modules/` were identified but not documented line-by-line because they are not maintained source.

## 1. Project Overview

### Purpose
This project is a browser-based developer journal UI. It lets a user log daily work, browse and search entries, manage standup notes, and maintain a personal notes page. It also includes login and registration flows plus route protection so private pages are not shown until browser-side auth state is present.

### Business Problem
The application addresses the common need to capture developer activity in one place:
- daily work completed,
- blockers and solutions,
- learning notes,
- standup updates,
- quick personal notes,
- and a simple authenticated workspace for viewing and editing that information.

### Overall Architecture
The code follows a route-first Next.js App Router architecture:
- `src/app` contains route entry points and layouts.
- `src/components` contains reusable UI, forms, and layout wrappers.
- `src/services` contains the data access layer.
- `src/models` contains TypeScript interfaces used as contracts.
- `src/lib` contains browser-side helpers, mainly auth state management.
- `public/` contains static files served directly by Next.js.

### How The Major Pieces Work Together
The runtime flow is:
1. Next.js renders the root layout from `src/app/layout.tsx`.
2. The global stylesheet and Bootstrap CSS are loaded.
3. A client-side Bootstrap loader imports Bootstrap JavaScript after hydration.
4. The home route checks browser auth state and redirects to either `/login` or `/dashboard`.
5. Login writes user data and token to `localStorage`.
6. Protected pages mount inside `ProtectedLayout`, which composes `AuthGuard` and `Navbar`.
7. Feature pages call service objects to fetch, search, create, update, or delete data.
8. Authenticated API calls use Axios with a request interceptor that injects the stored bearer token.
9. A 401 response clears local auth data and forces the browser back to `/login`.

## 2. Complete Application Execution Flow

### Startup
1. The browser requests a route.
2. Next.js resolves the matching page file under `src/app`.
3. `src/app/layout.tsx` wraps the page output, imports `src/app/globals.css`, and injects `BootstrapClient`.
4. Client components hydrate after the initial HTML is delivered.

### Initialization
1. `RootLayout` sets page metadata and basic HTML structure.
2. `BootstrapClient` runs a `useEffect` that dynamically imports `bootstrap/dist/js/bootstrap.bundle.min.js`.
3. `AuthGuard` on protected pages checks browser auth state through `src/lib/auth.ts`.
4. `Navbar` reads the current user from `localStorage` and renders navigation when a user exists.

### Request / Response Lifecycle
Because this is a frontend app, the lifecycle is mostly browser event to API call to UI update:
1. The user submits a form or clicks an action.
2. A component handler updates local state and calls a service method.
3. The service method either:
   - sends an Axios request to the backend API, or
   - filters in-memory data locally.
4. Axios request interceptors add the stored token when present.
5. The backend response is parsed and returned to the component.
6. The component updates state, causing a re-render.
7. If the backend returns 401, the interceptor removes stored auth data and redirects to `/login`.

### Data Flow
- Login data flows from the login form to `authService.login`, then to `apiClient`, then back to `saveAuthData`, and finally into the protected app shell.
- Daily log data flows from `dailyLogService` into dashboard, list, create, search, and edit pages.
- Standup data flows through local in-memory mock state in `standupService`.
- Notes flow through `noteService` to the backend and back into the notes editor.

### Module Communication
- Pages import shared components and services directly.
- Services import models and the shared Axios client.
- `apiClient` imports auth helpers to read tokens.
- `Navbar` and `AuthGuard` import auth helpers to read or clear session data.
- Forms import services and return success/error events to the parent page.

## 3. Complete Folder and File Documentation

### Root, Tooling, and Project Metadata

#### [package.json](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/package.json>)
- Purpose: project manifest, dependency manifest, and script entry point for npm.
- Code present: package name, version, scripts, runtime dependencies, and devDependencies.
- Defined items: `dev`, `build`, `start`, and `lint` scripts.
- How it works: Next.js and the toolchain read this file for install and execution commands.
- Execution: used by npm during install, development, production build, and linting.
- Depends on: none at runtime; consumed by npm and Next tooling.
- Used by: all code indirectly through the installed dependencies.
- Notes: declares Next 16.1.6, React 19.2.3, Bootstrap 5.3.3, Axios, TypeScript, ESLint, and `@svgr/webpack`.

#### [package-lock.json](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/package-lock.json>)
- Purpose: pins the exact dependency tree and transitive package versions.
- Code present: generated npm lockfile data.
- Defined items: root package metadata and all resolved package entries.
- How it works: npm uses it to reproduce installs consistently.
- Execution: not executed by the app; used during dependency installation and CI builds.
- Depends on: `package.json`.
- Used by: npm install, build, and reproducibility workflows.
- Notes: generated artifact, but important for deterministic dependency resolution.

#### [tsconfig.json](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/tsconfig.json>)
- Purpose: TypeScript compiler configuration.
- Code present: compiler options, include paths, and exclude paths.
- Defined items: path alias `@/* -> ./src/*`, strict mode, bundler resolution, noEmit, incremental compilation.
- How it works: TypeScript and Next.js use it to resolve imports and validate source files.
- Execution: read by the TypeScript language service, Next build, and editor tooling.
- Depends on: none.
- Used by: every TypeScript file under `src`.
- Notes: includes `.next/types` for generated route typing.

#### [next.config.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/next.config.ts>)
- Purpose: Next.js runtime/build configuration.
- Code present: a `nextConfig` object with a Turbopack SVG loader rule.
- Defined items: `turbopack.rules['*.svg']` using `@svgr/webpack` and outputting `.js`.
- How it works: lets SVG imports be transformed into React components if the codebase imports them.
- Execution: consumed by Next during dev and build.
- Depends on: Next config types and `@svgr/webpack`.
- Used by: Next build system.
- Notes: the current app does not import SVGs as React components, but the config is ready for that pattern.

#### [eslint.config.mjs](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/eslint.config.mjs>)
- Purpose: ESLint configuration for Next.js and TypeScript.
- Code present: `defineConfig`, `nextVitals`, `nextTs`, and ignore rules.
- Defined items: ignore patterns for `.next/`, `out/`, `build/`, and `next-env.d.ts`.
- How it works: ESLint loads this config when linting source files.
- Execution: used by `npm run lint`.
- Depends on: `eslint`, `eslint-config-next`.
- Used by: local development and CI linting.

#### [README.md](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/README.md>)
- Purpose: human-facing project documentation and setup guide.
- Code present: prose overview, features, folder structure, setup steps, and known issues.
- Defined items: documented routes, demo credentials, and architecture notes.
- How it works: informational only; not used by the runtime.
- Execution: read by developers, not by the app.
- Depends on: project state, but not code execution.
- Used by: onboarding and manual setup.
- Notes: describes features that do not fully match the codebase, especially around backend integration and the presence of standups and notes.

#### [DOTNET_BACKEND_PROJECT_PROMPT.md](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/DOTNET_BACKEND_PROJECT_PROMPT.md>)
- Purpose: backend architecture prompt/specification for a planned .NET API.
- Code present: a long requirements document describing a clean architecture backend.
- Defined items: entities, commands, queries, infrastructure ideas, validation, JWT, and EF Core concepts.
- How it works: it does not affect the frontend runtime.
- Execution: informational only.
- Depends on: none within this repository.
- Used by: humans designing the future backend.
- Notes: useful as a contract reference, but it is not implemented in this frontend repo.

#### [.gitignore](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/.gitignore>)
- Purpose: excludes generated and local-only files from version control.
- Code present: ignore patterns for node_modules, build output, environment files, logs, and Vercel files.
- Defined items: `.env*`, `.next/`, `node_modules/`, `*.tsbuildinfo`, and other build artifacts.
- How it works: Git uses it to avoid tracking transient files.
- Execution: used by Git, not the app.
- Depends on: none.
- Used by: version control hygiene.

#### [next-env.d.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/next-env.d.ts>)
- Purpose: generated Next.js type declaration entry.
- Code present: triple-slash type references and a generated route import.
- Defined items: Next and image type references.
- How it works: TypeScript uses it to pick up Next-specific types.
- Execution: read by the compiler and editor.
- Depends on: `.next/dev/types/routes.d.ts` generated by Next.
- Used by: all TypeScript source files indirectly.
- Notes: generated file and not meant to be edited manually.

#### [src/app/favicon.ico](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/favicon.ico>)
- Purpose: browser tab icon for the app.
- Code present: binary favicon asset.
- Defined items: none in source code form.
- How it works: Next App Router automatically serves it as the site icon.
- Execution: handled by Next during page rendering.
- Depends on: none.
- Used by: browser tabs and bookmarks.

#### [public/file.svg](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/public/file.svg>), [public/globe.svg](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/public/globe.svg>), [public/next.svg](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/public/next.svg>), [public/vercel.svg](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/public/vercel.svg>), [public/window.svg](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/public/window.svg>)
- Purpose: static SVG assets from the default Next.js starter set.
- Code present: standalone SVG markup in each file.
- Defined items: graphic paths only.
- How it works: Next can serve them statically from `/`.
- Execution: only if a page links to or imports them.
- Depends on: none.
- Used by: no current source file references them.
- Notes: these are currently unused by the application code.

### App Router Shell and Global Styling

#### [src/app/layout.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/layout.tsx>)
- Purpose: root HTML shell for the entire app.
- Code present: `metadata` export and `RootLayout` component.
- Defined items: title, description, `<html>`, `<body>`, and the `BootstrapClient` mount.
- How it works: wraps every route, injects global CSS, and loads Bootstrap JS client-side.
- Execution: rendered for every route request.
- Depends on: `src/app/globals.css`, `src/app/BootstrapClient.tsx`.
- Used by: all app routes.
- Notes: this is a server component, while `BootstrapClient` is the client-only bridge for Bootstrap behavior.

#### [src/app/globals.css](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/globals.css>)
- Purpose: global visual system and Bootstrap import.
- Code present: Bootstrap CSS import, CSS variables, resets, utility classes, layout classes, auth card styling, notes editor styling, and responsive rules.
- Defined items: design tokens such as colors, spacing, shadows, typography, and helper classes like `.card-elevated`, `.auth-container`, `.notes-editor`, `.empty-state`.
- How it works: styles every route and shared component.
- Execution: loaded once through the root layout.
- Depends on: Bootstrap CSS.
- Used by: all pages and components.
- Notes: the app uses Bootstrap plus custom tokens instead of a utility-only CSS framework.

#### [src/app/BootstrapClient.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/BootstrapClient.tsx>)
- Purpose: client-side loader for Bootstrap JavaScript.
- Code present: a `useEffect` that dynamically imports `bootstrap/dist/js/bootstrap.bundle.min.js`.
- Defined items: default `BootstrapClient` component.
- How it works: runs after hydration to enable Bootstrap components like dropdowns, collapse, and modals.
- Execution: mounted by `RootLayout` on every page.
- Depends on: Bootstrap bundle package and the browser environment.
- Used by: layout and every Bootstrap interactive component in the app.

#### [src/app/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/page.tsx>)
- Purpose: root `/` route redirector.
- Code present: a client component with `useEffect`, `useRouter`, and `isAuthenticated`.
- Defined items: `HomePage` component.
- How it works: checks browser auth state and redirects to `/dashboard` if signed in or `/login` if not.
- Execution: rendered when the user visits `/`.
- Depends on: `src/lib/auth.ts`, Next navigation hooks.
- Used by: the root route only.
- Notes: displays a spinner while the redirect decision is being made.

### Authentication Pages

#### [src/app/login/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/login/page.tsx>)
- Purpose: login route wrapper.
- Code present: a server component that renders `LoginPageClient` inside `Suspense`.
- Defined items: fallback spinner UI and the client login page mount.
- How it works: provides a loading shell while the client component resolves.
- Execution: rendered on `/login`.
- Depends on: `src/app/login/LoginPageClient.tsx`.
- Used by: browser navigation to the login route.

#### [src/app/login/LoginPageClient.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/login/LoginPageClient.tsx>)
- Purpose: interactive login form and auth handoff.
- Code present: stateful form component, submit handler, router navigation, and success/error messaging.
- Defined items: `LoginPageClient` component.
- How it works: collects email and password, calls `authService.login`, saves the returned user and token with `saveAuthData`, and routes to `/dashboard`.
- Execution: mounted inside the login page wrapper.
- Depends on: `src/services/auth-service.ts`, `src/lib/auth.ts`, Next router, `Link`, and `useSearchParams`.
- Used by: `src/app/login/page.tsx`.
- Notes: reads `?registered=true` from the URL to show a registration success banner.

#### [src/app/register/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/register/page.tsx>)
- Purpose: self-service registration page.
- Code present: client-side form, local validation function, submit handler, and navigation to login on success.
- Defined items: `RegisterPage` component and a local `validateForm` helper.
- How it works: validates required fields, password length, and password confirmation, then calls `authService.register`.
- Execution: mounted at `/register`.
- Depends on: `src/services/auth-service.ts`, Next router, and `Link`.
- Used by: users who are creating an account from the login page.
- Notes: validation is local and minimal; it does not validate email format or password complexity beyond length.

### Dashboard

#### [src/app/dashboard/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/dashboard/page.tsx>)
- Purpose: authenticated overview page.
- Code present: client component with state for recent logs, loading flag, and current user name.
- Defined items: `DashboardPage` component and a local `formatDate` helper.
- How it works: reads the current user from `localStorage`, fetches all daily logs, keeps the five newest, and renders stat cards plus quick actions.
- Execution: mounted at `/dashboard` inside `ProtectedLayout`.
- Depends on: `src/components/layouts/ProtectedLayout.tsx`, `src/services/dailylog-service.ts`, `src/lib/auth.ts`, `src/models/DailyLog.ts`.
- Used by: protected navigation after login and the home-route redirect.
- Notes: the four statistic cards all use `recentLogs.length`, so the counts are placeholders rather than independent metrics.

### Daily Logs Route Group

#### [src/app/dailylogs/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/dailylogs/page.tsx>)
- Purpose: list, search, edit, and delete daily logs.
- Code present: client component with local state for log lists, search filters, edit and delete modals, and loading flags.
- Defined items: `DailyLogsPage` component plus helper handlers for search, clear, delete, and edit.
- How it works: loads all logs, filters them locally through `dailyLogService.searchLogs`, opens a modal for deletion or editing, and updates local state after service calls.
- Execution: mounted at `/dailylogs` inside `ProtectedLayout`.
- Depends on: `src/components/forms/DailyLogForm.tsx`, `src/components/ui/DailyLogCard.tsx`, `src/services/dailylog-service.ts`, `src/models/DailyLog.ts`.
- Used by: the daily logs navigation entry and dashboard quick actions.
- Notes: the search feature is client-side and based on already fetched data, not a server query.

#### [src/app/dailylogs/create/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/dailylogs/create/page.tsx>)
- Purpose: create daily log page.
- Code present: client page with loading/success/error state, breadcrumbs, instructional copy, and the `DailyLogForm`.
- Defined items: `CreateDailyLogPage` component and submit state callbacks.
- How it works: passes callbacks into `DailyLogForm`, shows a success banner, then redirects to `/dailylogs` after a short delay.
- Execution: mounted at `/dailylogs/create`.
- Depends on: `src/components/forms/DailyLogForm.tsx`, `src/components/layouts/ProtectedLayout.tsx`, Next router.
- Used by: dashboard quick action and daily logs page links.

#### [src/app/dailylogs/search/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/dailylogs/search/page.tsx>)
- Purpose: dedicated daily log search page.
- Code present: client component with search form, result list, empty state, and loading/error states.
- Defined items: `SearchDailyLogsPage`.
- How it works: submits `SearchFilters` to `dailyLogService.searchLogs` and renders `DailyLogCard` results.
- Execution: mounted at `/dailylogs/search`.
- Depends on: `src/services/dailylog-service.ts`, `src/components/ui/DailyLogCard.tsx`, `src/components/layouts/ProtectedLayout.tsx`, `src/models/DailyLog.ts`.
- Used by: navbar, dashboard quick actions, and daily logs page.

### Notes

#### [src/app/notes/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/notes/page.tsx>)
- Purpose: personal notes editor.
- Code present: client component with textarea state, save-state indicator, a `useRef` cache for the last persisted content, and debounced autosave logic.
- Defined items: `NotesPage` component.
- How it works: loads the note from `noteService`, stores the content in local state, and saves after 600ms of inactivity when the text changes.
- Execution: mounted at `/notes` inside `ProtectedLayout` with the `fullPage` layout mode.
- Depends on: `src/services/note-service.ts`, `src/components/layouts/ProtectedLayout.tsx`.
- Used by: the Notes link in the navbar.
- Notes: the `loadedContent` ref prevents an immediate save of the initial backend payload.

### Standups Route Group

#### [src/app/standups/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/standups/page.tsx>)
- Purpose: list, search, edit, and delete standup entries.
- Code present: client component mirroring the daily logs list page, but wired to the standup domain.
- Defined items: `StandupsPage` component plus local handlers for search, delete, and edit.
- How it works: loads standups from the mock service, filters locally, and updates module state after edits and deletes.
- Execution: mounted at `/standups` inside `ProtectedLayout`.
- Depends on: `src/components/forms/StandupForm.tsx`, `src/components/ui/StandupCard.tsx`, `src/services/standup-service.ts`, `src/models/Standup.ts`.
- Used by: navbar and standup-related navigation flows.
- Notes: the service is in-memory, so changes are not persisted across a browser refresh.

#### [src/app/standups/create/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/standups/create/page.tsx>)
- Purpose: create standup page.
- Code present: client page with loading/success/error state, breadcrumbs, guidance text, and the `StandupForm`.
- Defined items: `CreateStandupPage`.
- How it works: passes callbacks into `StandupForm`, shows success, and redirects to `/standups`.
- Execution: mounted at `/standups/create`.
- Depends on: `src/components/forms/StandupForm.tsx`, `src/components/layouts/ProtectedLayout.tsx`, Next router.
- Used by: the standup list page and navbar links.

#### [src/app/standups/search/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/standups/search/page.tsx>)
- Purpose: dedicated standup search page.
- Code present: client search form and result renderer.
- Defined items: `SearchStandupsPage`.
- How it works: filters standups locally using `standupService.searchStandups` and displays `StandupCard` entries.
- Execution: mounted at `/standups/search`.
- Depends on: `src/services/standup-service.ts`, `src/components/ui/StandupCard.tsx`, `src/components/layouts/ProtectedLayout.tsx`, `src/models/Standup.ts`.
- Used by: standup navigation and the dashboard/menu flows.

### Shared Layout and UI Components

#### [src/components/layouts/ProtectedLayout.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/layouts/ProtectedLayout.tsx>)
- Purpose: shared shell for authenticated pages.
- Code present: a wrapper component that composes `AuthGuard`, `Navbar`, and a `<main>` element.
- Defined items: `ProtectedLayout` with an optional `fullPage` prop.
- How it works: blocks unauthenticated access, renders the navigation bar, and applies spacing classes.
- Execution: used by all protected route pages.
- Depends on: `src/components/ui/AuthGuard.tsx`, `src/components/ui/Navbar.tsx`.
- Used by: dashboard, daily logs, notes, and standup pages.

#### [src/components/ui/AuthGuard.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/ui/AuthGuard.tsx>)
- Purpose: client-side route guard.
- Code present: a component with `useEffect`, `useRouter`, `usePathname`, and local authorization state.
- Defined items: `AuthGuard` component.
- How it works: reads `localStorage` via `isAuthenticated`; if the user is not authenticated and the route is not `/login`, it redirects to `/login`. Otherwise it allows rendering.
- Execution: mounted inside `ProtectedLayout`.
- Depends on: `src/lib/auth.ts`.
- Used by: all protected pages.
- Notes: there is no storage event listener, so auth changes in another browser tab will not automatically re-render this tab.

#### [src/components/ui/Navbar.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/ui/Navbar.tsx>)
- Purpose: primary authenticated navigation bar.
- Code present: client component with active-route logic, logout handler, dropdown markup, and user display.
- Defined items: `Navbar` component and an `isActive` helper.
- How it works: reads the current user from `localStorage`, renders links for dashboard, daily logs, and notes, and clears auth data on logout.
- Execution: rendered within `ProtectedLayout` after auth succeeds.
- Depends on: `src/lib/auth.ts`, `src/models/User.ts`, Next routing/linking.
- Used by: every authenticated page.
- Notes: dropdown and collapse behavior rely on Bootstrap JavaScript loaded by `BootstrapClient`.

#### [src/components/ui/DailyLogCard.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/ui/DailyLogCard.tsx>)
- Purpose: read-only daily log presentation card.
- Code present: card UI with date formatting, sectioned content, edit/delete buttons, and optional tip and git-link blocks.
- Defined items: `DailyLogCard` component and a local `formatDate` helper.
- How it works: renders a single `DailyLog` and triggers optional edit/delete callbacks when buttons are clicked.
- Execution: used on daily log list and search pages, and in the dashboard recent list.
- Depends on: `src/models/DailyLog.ts`.
- Used by: daily log pages.
- Notes: the dashboard preview uses only a subset of the fields and truncates problem text separately.

#### [src/components/ui/StandupCard.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/ui/StandupCard.tsx>)
- Purpose: read-only standup presentation card.
- Code present: card UI with date formatting, sectioned text blocks, and optional edit/delete buttons.
- Defined items: `StandupCard` component and a local `formatDate` helper.
- How it works: renders a `Standup` object and preserves line breaks using `whitespace-pre-line`.
- Execution: used on standup list and search pages.
- Depends on: `src/models/Standup.ts`.
- Used by: standup pages.

### Shared Forms

#### [src/components/forms/DailyLogForm.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/forms/DailyLogForm.tsx>)
- Purpose: create/edit form for daily logs.
- Code present: controlled form state, validation, reset logic, submit handler, and field-level error handling.
- Defined items: `DailyLogForm` component and `validateForm` / `handleSubmit` / `handleChange` helpers.
- How it works: initializes state from `initialData`, validates required fields, trims values, then calls `dailyLogService.createLog` or `updateLog` depending on `mode`.
- Execution: used on the create page and inside the edit modal on the list page.
- Depends on: `src/services/dailylog-service.ts`, `src/models/DailyLog.ts`.
- Used by: `src/app/dailylogs/create/page.tsx` and `src/app/dailylogs/page.tsx`.
- Notes: validation is intentionally lightweight and only enforces `logDate` and `tasksWorked` in the client.

#### [src/components/forms/StandupForm.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/forms/StandupForm.tsx>)
- Purpose: create/edit form for standups.
- Code present: controlled form state, validation, reset logic, submit handler, and field-level error handling.
- Defined items: `StandupForm` component and local helper functions analogous to the daily log form.
- How it works: initializes from `initialData`, validates required standup fields, then calls `standupService.createStandup` or `updateStandup`.
- Execution: used on the standup create page and inside the edit modal on the list page.
- Depends on: `src/services/standup-service.ts`, `src/models/Standup.ts`.
- Used by: `src/app/standups/create/page.tsx` and `src/app/standups/page.tsx`.
- Notes: because the service is in-memory, edits and deletes only survive until the page is refreshed.

### Browser Auth Helpers

#### [src/lib/auth.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/lib/auth.ts>)
- Purpose: browser-side auth state utilities.
- Code present: helper functions for reading, storing, and clearing auth data from `localStorage`.
- Defined items: `getCurrentUser`, `getToken`, `isAuthenticated`, `saveAuthData`, `logout`, and alias `clearAuthData`.
- How it works: serializes user data to `developer_journal_user` and token data to `developer_journal_token`.
- Execution: called by login, logout, guards, interceptors, navbar, and the home redirector.
- Depends on: `src/models/User.ts`.
- Used by: `AuthGuard`, `Navbar`, `LoginPageClient`, `HomePage`, and `api-client`.
- Notes: all functions guard against server-side execution with `typeof window === 'undefined'`.

### Data Models

#### [src/models/User.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/models/User.ts>)
- Purpose: auth and user-related TypeScript contracts.
- Code present: interfaces for `User`, `LoginCredentials`, `RegisterRequest`, and `AuthResponse`.
- Defined items: user shape, login credentials, registration payload, and auth response payload.
- How it works: provides type safety for the auth service, login page, register page, and navbar.
- Execution: compile-time only.
- Depends on: none.
- Used by: auth-related UI and services.
- Notes: the `role` union uses human-readable strings such as `Senior Developer` and `Team Lead`.

#### [src/models/DailyLog.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/models/DailyLog.ts>)
- Purpose: daily log data contracts.
- Code present: interfaces for `DailyLog`, `CreateDailyLogDto`, and `SearchFilters`.
- Defined items: all daily log fields plus optional `gitLink`.
- How it works: defines the shape shared by pages, cards, forms, and the daily log service.
- Execution: compile-time only.
- Depends on: none.
- Used by: daily log pages, components, and service code.

#### [src/models/Standup.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/models/Standup.ts>)
- Purpose: standup data contracts.
- Code present: interfaces for `Standup`, `CreateStandupDto`, and `SearchFilters`.
- Defined items: all standup fields plus optional `notes`.
- How it works: defines the shape shared by standup pages, cards, forms, and the standup service.
- Execution: compile-time only.
- Depends on: none.
- Used by: standup pages, components, and service code.

#### [src/models/Note.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/models/Note.ts>)
- Purpose: notes data contract.
- Code present: `Note` interface.
- Defined items: `id`, `content`, and `updatedAtUtc`.
- How it works: types the values returned and saved by `noteService`.
- Execution: compile-time only.
- Depends on: none.
- Used by: notes page and note service.

### Services and API Layer

#### [src/services/api-client.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/services/api-client.ts>)
- Purpose: shared Axios wrapper and central API configuration.
- Code present: `ApiClient` class plus a singleton `apiClient`.
- Defined items: `get`, `post`, `put`, `delete`, and `patch` methods; request and response interceptors.
- How it works: creates an Axios instance with a base URL, injects the bearer token from `localStorage`, and clears auth data on 401 before redirecting to `/login`.
- Execution: instantiated at module import time.
- Depends on: Axios and `src/lib/auth.ts`.
- Used by: `auth-service`, `dailylog-service`, and `note-service`.
- Notes: the base URL falls back to `https://devloggerbackend.onrender.com/api` when `NEXT_PUBLIC_API_BASE_URL` is not set.

#### [src/services/auth-service.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/services/auth-service.ts>)
- Purpose: auth API abstraction.
- Code present: `authService` object and a local `getErrorMessage` helper.
- Defined items: `login`, `verifyToken`, and `register`.
- How it works: wraps API calls, normalizes Axios errors into user-friendly `Error` messages, and returns typed auth payloads.
- Execution: called by login and register pages; `verifyToken` is currently unused.
- Depends on: `src/services/api-client.ts`, `src/models/User.ts`, Axios error typing.
- Used by: `src/app/login/LoginPageClient.tsx` and `src/app/register/page.tsx`.
- Notes: endpoints are `/Auth/login`, `/auth/verify`, and `/Auth/register`, so route casing must match the backend.

#### [src/services/dailylog-service.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/services/dailylog-service.ts>)
- Purpose: daily log API abstraction plus client-side search helper.
- Code present: helper functions `sortByLogDateDesc` and `applyClientFilters`, and a `dailyLogService` object.
- Defined items: `getAllLogs`, `getLogById`, `createLog`, `updateLog`, `deleteLog`, and `searchLogs`.
- How it works: retrieves logs from the backend, sorts them by date descending, and performs keyword/date filtering locally.
- Execution: called by dashboard, daily logs pages, and the daily log form.
- Depends on: `src/services/api-client.ts`, `src/models/DailyLog.ts`.
- Used by: daily log UI.
- Notes: `searchLogs` does not call the backend search endpoint; it fetches all logs first and filters in memory.

#### [src/services/standup-service.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/services/standup-service.ts>)
- Purpose: standup data service for a local mock workflow.
- Code present: module-scoped in-memory `standups` array, `nextId` counter, helpers, and the `standupService` object.
- Defined items: `getAllStandups`, `getStandupById`, `createStandup`, `updateStandup`, `deleteStandup`, and `searchStandups`.
- How it works: simulates latency with `setTimeout`, mutates module state, and filters standups locally.
- Execution: called by standup pages and forms.
- Depends on: `src/models/Standup.ts`.
- Used by: all standup-related UI.
- Notes: this data is not persisted to storage, so it resets on refresh or full reload.

#### [src/services/note-service.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/services/note-service.ts>)
- Purpose: backend-backed note retrieval and persistence.
- Code present: `noteService` with `getNote` and `saveNote`.
- Defined items: two methods for reading and updating the single note payload.
- How it works: issues `GET /Notes` and `PUT /Notes` through `apiClient`.
- Execution: called by the notes page.
- Depends on: `src/services/api-client.ts`, `src/models/Note.ts`.
- Used by: `src/app/notes/page.tsx`.

## 4. Code Execution Flow

### Chronological Flow
1. Browser loads a route.
2. Next.js renders `src/app/layout.tsx`.
3. `globals.css` loads Bootstrap CSS and the app design tokens.
4. `BootstrapClient` loads Bootstrap JavaScript after hydration.
5. The root route checks auth state and redirects.
6. Login and registration pages collect credentials.
7. `authService` sends credentials to the backend through `apiClient`.
8. On success, auth data is written to `localStorage`.
9. Protected pages mount through `ProtectedLayout`.
10. `AuthGuard` verifies auth state and redirects away if needed.
11. `Navbar` displays the current user and routes.
12. Feature pages load their data.
13. Form submissions and edit/delete actions call the relevant services.
14. The page state updates and the UI re-renders.

### Configuration Loading
- Next.js reads `package.json`, `tsconfig.json`, `next.config.ts`, and `eslint.config.mjs`.
- `apiClient` reads `process.env.NEXT_PUBLIC_API_BASE_URL` if it exists.
- If the environment variable is absent, the app uses the hard-coded hosted backend URL.
- No `.env.local` file is present in the repository snapshot, so local configuration is optional rather than checked in.

### Dependency Injection
- There is no server-side DI container in this repo.
- The code uses direct imports and singleton modules instead.
- `apiClient`, `authService`, `dailyLogService`, `standupService`, and `noteService` are imported directly where needed.

### Routing
- Route entry points live under `src/app`.
- `page.tsx` files define route segments and nested paths.
- Navigation uses Next router APIs and `Link` components.
- Protected pages are wrapped with `ProtectedLayout`.

### Middleware-Like Behavior
- There is no `middleware.ts` file in this repository.
- Client-side behavior fills that role:
  - `AuthGuard` acts as a route gate.
  - `apiClient` acts as a request/response interceptor layer.
  - `BootstrapClient` acts as a runtime initializer for Bootstrap JS.

### Authentication and Authorization
- Authentication is browser-side and localStorage-based.
- The login form gets a token and user object from the backend and stores them locally.
- `AuthGuard` treats presence of both stored user and token as authenticated.
- `Navbar` reads the user for display and logout.
- Authorization is not enforced by the frontend beyond route hiding and redirect behavior.

### Validation
- Validation is local and form-specific.
- `LoginPageClient` relies mostly on required HTML inputs.
- `RegisterPage` checks field presence, password length, and password confirmation.
- `DailyLogForm` validates `logDate` and `tasksWorked`.
- `StandupForm` validates the required standup fields.
- There is no shared schema validation library in this repo.

### Business Logic
- Daily log business logic is split between form validation, local sorting, local filtering, and backend calls.
- Standup business logic is local and in-memory.
- Notes business logic is a debounced auto-save.
- Dashboard logic is an aggregate preview plus quick actions.

### Service Layer
- `authService` normalizes auth errors.
- `dailyLogService` sorts and filters log data.
- `standupService` simulates CRUD on local state.
- `noteService` maps note reads and writes to backend endpoints.

### Database Interactions
- There is no database schema, ORM, or migration file in this frontend repo.
- Database interaction only occurs indirectly through backend API calls from `dailyLogService`, `authService`, and `noteService`.
- `standupService` and auth helpers use browser storage or module memory instead of a database.

### Logging
- Logging is minimal and browser-side.
- Error cases use `console.error` in forms and auth parsing.
- `DashboardPage` logs fetch errors to the console.
- There is no centralized logging infrastructure in the frontend code.

### Exception Handling
- `apiClient` handles 401 responses globally.
- `authService` converts Axios failures into `Error` objects with user-facing text.
- Forms catch exceptions and surface messages in alerts.
- `AuthGuard` redirects unauthenticated users rather than throwing.

### Background Jobs, Schedulers, and Event Processing
- There are no background jobs or schedulers.
- The only timer-based behavior is the 600 ms debounce in `NotesPage`.
- `standupService` and form submit functions use artificial delays to simulate network latency or asynchronous operations.

## 5. Database Documentation

### What Exists In This Repository
There is no frontend database layer in this repo. That means:
- no SQL schema,
- no ORM entities,
- no migrations,
- no seed scripts,
- no repository classes,
- and no local database initialization code.

### Data Models In The Frontend
The frontend defines the following contract types:
- `User` in `src/models/User.ts`
- `DailyLog` in `src/models/DailyLog.ts`
- `Standup` in `src/models/Standup.ts`
- `Note` in `src/models/Note.ts`

### Relationships
- The frontend models are not relational tables.
- Any table-level relationships described in `DOTNET_BACKEND_PROJECT_PROMPT.md` are backend design goals, not implemented code in this project.

### CRUD Behavior
- Auth CRUD behavior is routed through backend endpoints via `authService`.
- Daily log CRUD behavior is routed through backend endpoints via `dailyLogService`.
- Note read/update behavior is routed through backend endpoints via `noteService`.
- Standup CRUD behavior is local and in-memory only.

### Query Flow
- Daily log search fetches all logs and filters them locally in the browser.
- Standup search does the same against local mock data.
- Notes do not use search.

## 6. Dependencies

### Internal Dependencies
- `src/app/*` pages depend on `src/components/*`, `src/services/*`, `src/models/*`, and `src/lib/auth.ts`.
- `src/components/forms/*` depend on services and model types.
- `src/components/ui/*` depend on model types and auth helpers.
- `src/services/*` depend on the shared Axios client or model types.
- `src/lib/auth.ts` depends on `src/models/User.ts`.

### External Dependencies
- `next`: routing, layouts, metadata, navigation, and build system.
- `react` and `react-dom`: component rendering and hooks.
- `bootstrap`: styling and interactive UI patterns.
- `@popperjs/core`: Bootstrap positioning support.
- `axios`: HTTP client abstraction.
- `typescript`: type checking and compile-time safety.
- `eslint` and `eslint-config-next`: linting and Next-aware lint rules.
- `@svgr/webpack`: SVG-to-React import support if SVG imports are added.

### Why Each Important Dependency Exists
- Next.js provides the App Router, route segments, and server/client component split.
- React provides the stateful component model used throughout the app.
- Bootstrap provides the visual system and modal/dropdown styles and behavior.
- Axios provides HTTP request handling and interceptor support.
- TypeScript provides the strongly typed data contract layer.

## 7. Configuration

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` is the only runtime environment variable used by the code.
- It controls the base URL for `apiClient`.
- If it is not set, the app uses the production backend URL baked into `api-client.ts`.

### Configuration Files
- `package.json` defines scripts and dependency versions.
- `tsconfig.json` defines compilation and import resolution rules.
- `next.config.ts` defines Turbopack SVG handling.
- `eslint.config.mjs` defines linting rules and ignores.
- `.gitignore` excludes generated and local files.

### Runtime Configuration
- `RootLayout` sets metadata and loads global styles.
- `apiClient` sets the API base URL and auth interception.
- `ProtectedLayout` controls whether protected screens show the main shell.
- `NotesPage` uses a debounce window for autosave.

### Build Configuration
- `npm run dev` uses `next dev --turbopack`.
- `npm run build` uses `next build`.
- `npm run start` uses `next start`.
- `npm run lint` uses ESLint.

### Deployment Configuration
- No deployment manifest is present in the repository.
- The app appears ready for deployment to a Next-compatible platform.
- The backend base URL default suggests a hosted backend is expected in production.

### Secrets Management
- No checked-in secrets are present.
- The repository relies on environment variables for the API URL.
- Auth tokens are stored in browser localStorage, which is convenient but not the safest production approach.

## 8. Feature Documentation

### Authentication
- Files: `src/app/login/page.tsx`, `src/app/login/LoginPageClient.tsx`, `src/app/register/page.tsx`, `src/lib/auth.ts`, `src/services/auth-service.ts`, `src/services/api-client.ts`, `src/components/ui/AuthGuard.tsx`, `src/components/ui/Navbar.tsx`, `src/app/page.tsx`.
- How it works: the login form posts credentials to the backend, stores the returned user and token in `localStorage`, and protected pages use that local state to decide whether to render or redirect.
- APIs involved: `/Auth/login`, `/Auth/register`, `/auth/verify` in the auth service; bearer token injection in `apiClient`.
- Data interactions: browser localStorage for session state.
- Frontend/backend communication: login and registration are backend-backed; token verification is coded but not used by the current UI.

### Daily Log Management
- Files: `src/models/DailyLog.ts`, `src/services/dailylog-service.ts`, `src/components/forms/DailyLogForm.tsx`, `src/components/ui/DailyLogCard.tsx`, `src/app/dailylogs/page.tsx`, `src/app/dailylogs/create/page.tsx`, `src/app/dailylogs/search/page.tsx`, `src/app/dashboard/page.tsx`.
- How it works: the UI fetches logs from the backend, sorts them by date, displays cards, allows create/edit/delete through a form, and filters the list locally.
- APIs involved: `GET /DailyLogs`, `GET /DailyLogs/{id}`, `POST /DailyLogs`, `PUT /DailyLogs/{id}`, and `DELETE /DailyLogs/{id}` through `apiClient`.
- Data interactions: backend for CRUD, browser memory for current page state.
- Frontend/backend communication: service objects hide Axios usage behind typed methods.

### Standups
- Files: `src/models/Standup.ts`, `src/services/standup-service.ts`, `src/components/forms/StandupForm.tsx`, `src/components/ui/StandupCard.tsx`, `src/app/standups/page.tsx`, `src/app/standups/create/page.tsx`, `src/app/standups/search/page.tsx`.
- How it works: standups are stored in a module-scoped array, filtered locally, and mutated through create/edit/delete actions.
- APIs involved: none external in the current implementation.
- Data interactions: in-memory only, reset on refresh.
- Frontend/backend communication: none yet; this feature is mock-only.

### Notes
- Files: `src/models/Note.ts`, `src/services/note-service.ts`, `src/app/notes/page.tsx`.
- How it works: the page loads one note, allows editing in a full-page textarea, and auto-saves after a short debounce.
- APIs involved: `GET /Notes` and `PUT /Notes`.
- Data interactions: backend-backed persistence plus local optimistic UI state.
- Frontend/backend communication: handled through `apiClient`.

### Navigation and Shell
- Files: `src/components/layouts/ProtectedLayout.tsx`, `src/components/ui/AuthGuard.tsx`, `src/components/ui/Navbar.tsx`, `src/app/layout.tsx`, `src/app/BootstrapClient.tsx`, `src/app/globals.css`.
- How it works: the shell protects routes, provides navigation, and loads Bootstrap behavior for interactive elements.
- APIs involved: browser storage and Next navigation only.
- Data interactions: no backend calls in the shell itself.

## 9. Architecture and Design Patterns

### Overall Architecture
- Route-driven App Router architecture.
- Component composition over class-based inheritance.
- Service layer between UI and remote/local data access.
- Typed model contracts shared across the app.

### Folder Organization
- `src/app`: route segments and page shells.
- `src/components/forms`: stateful data-entry forms.
- `src/components/ui`: reusable presentational components.
- `src/components/layouts`: shell wrappers.
- `src/services`: API and data access logic.
- `src/models`: interface definitions.
- `src/lib`: browser utilities.

### Design Patterns Used
- Controlled React forms.
- Client-side route guarding.
- Singleton service objects.
- Axios interceptor pattern.
- Debounced autosave.
- Presentation component plus container page split.
- Mock service adapter for standup data.

### Coding Standards
- TypeScript strict mode is enabled.
- Imports use the `@` alias.
- Components are functional and hook-based.
- State is localized to the smallest practical scope.
- Async work uses `async`/`await`.

### Best Practices Observed
- Auth checks are isolated into reusable helpers.
- Axios token injection is centralized.
- Forms use callbacks to notify parents about loading and success states.
- Reusable cards and forms reduce duplicate UI code.
- Bootstrap JS is loaded only on the client.

## 10. Developer Notes

- The repository is frontend-only. Any database schema or CQRS design in `DOTNET_BACKEND_PROJECT_PROMPT.md` is aspirational and not implemented here.
- The login/register/auth helpers are browser-local and not secure enough for production without backend hardening.
- Standups are session-local mock data and should be replaced with a real API or storage layer if the feature matters.
- Daily log search is client-side and becomes expensive as the dataset grows.
- The dashboard statistics are placeholders and should be replaced with real aggregates.
- `authService.verifyToken` exists but is not used by the current UI.
- Several routes use `<a href="...">` instead of Next `Link`, which triggers full page navigations rather than client-side transitions.
- The README omits standups and notes, but the codebase does implement them.

## 11. Additional Observations

### Performance Considerations
- Client-side search copies and filters the full daily log or standup list in memory.
- Standup data lives in a module-level array, so it is fast but ephemeral.
- The notes page debounces saves, which reduces request volume.

### Security Considerations
- Auth data is stored in localStorage, which is vulnerable to XSS if the app ever renders unsafe content.
- There is no refresh token flow.
- There is no HTTP-only cookie strategy in the current implementation.
- There is no role-based authorization enforced in the frontend.

### Potential Improvements
- Move auth state into secure cookies.
- Add real server-side validation feedback.
- Replace the in-memory standup service with a real backend.
- Push daily log search to the backend for larger datasets.
- Replace placeholder dashboard metrics with real counts and aggregates.
- Add storage event listeners so auth changes sync across tabs.
- Replace repeated `<a href>` tags with `Link` components for client-side navigation.

### Common Pitfalls
- If `NEXT_PUBLIC_API_BASE_URL` is not set in local development, requests will go to the hard-coded hosted backend URL.
- Bootstrap interactive components will not work if `BootstrapClient` is removed.
- The standup list will appear to lose changes on refresh because it is not persisted.
- Notes can silently fail to save if the backend is unavailable.
- AuthGuard relies on localStorage, so server-side rendering does not have authoritative auth context.

### Hidden Implementation Details
- The notes editor uses a `useRef` cache so the first backend load does not trigger an immediate save.
- Axios 401 handling forcefully clears local auth and performs a hard redirect.
- The root page uses `router.replace`, not `push`, to avoid leaving the redirect choice in browser history.
- The dashboard recent logs list is sorted by the service before slicing the first five entries.

### Areas Requiring Special Attention
- The frontend and the backend prompt are not fully aligned on the data model and responsibilities.
- The service layer is mixed: some features are backend-backed while others are mock-only.
- There is no actual database code in this repository, so database documentation must be interpreted as future backend work.
- The current UI is functional, but auth and persistence should be hardened before any production use.

## 12. Form Practice Feature and Related File Analysis

This section documents the four newly analyzed files without removing or replacing any earlier project summary. It also updates the earlier Navbar description: the current Navbar includes a `Form Practice` link to `/form-practice` in addition to Dashboard, Daily Logs, and Notes.

### Feature Overview

- Purpose: provide an authenticated practice screen that demonstrates common HTML form controls and supports creating, viewing, searching, selecting, editing, and deleting practice records.
- Route: `/form-practice`.
- Persistence: browser `localStorage`, scoped by the authenticated user's ID.
- Backend/API use: none. This feature does not use Axios, `apiClient`, an HTTP endpoint, or a database.
- Main dependency flow: `Navbar` links to the route; `FormPracticePage` reads the signed-in user, uses the `PracticeEntry` types, and calls `practiceEntryService`; the service persists typed entries in `localStorage`.
- Authentication boundary: the page is wrapped in `ProtectedLayout`. It also requires `getCurrentUser()?.id` before it loads or saves data.

### File Interaction Map

1. `src/components/ui/Navbar.tsx` exposes the `/form-practice` navigation link on authenticated screens.
2. Next.js maps `src/app/form-practice/page.tsx` to the `/form-practice` URL.
3. `FormPracticePage` gets the active user ID from `src/lib/auth.ts`.
4. The page uses `PracticeEntry` for stored rows and `PracticeEntryInput` for create/update payloads.
5. `practiceEntryService` reads and writes the key `journal-form-practice:<userId>` in browser `localStorage`.
6. Successful CRUD calls update both persistent storage and the page's React state, causing the table to re-render immediately.

### [src/app/form-practice/page.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/app/form-practice/page.tsx>)

- Purpose: route component, form controller, validation layer, search/list controller, and CRUD user interface for the Form Practice feature.
- Route and rendering mode: the file defines `/form-practice` and begins with `'use client'` because it uses React hooks, browser storage indirectly, `window`, DOM refs, confirmation dialogs, and `crypto` indirectly through the service.
- Default export: `FormPracticePage`.
- Imported code:
  - `FormEvent`, `useEffect`, `useRef`, and `useState` from React.
  - `ProtectedLayout` for authenticated page structure.
  - `getCurrentUser` for the signed-in user's ID.
  - `PracticeEntry` and `PracticeEntryInput` for type-safe page state and service payloads.
  - `practiceEntryService` for local CRUD operations.

#### Local Types and Constants

- `PracticeForm`: derived from `PracticeEntryInput` with `hours` changed from `number` to `string`. Keeping the input as a string allows the controlled number field to be empty while the user is typing; submission converts it to a number.
- `emptyForm`: the initial and reset state for every form control. Text/date fields start empty, `completed` starts `false`, and `rating` starts at `0` so the user must choose a rating.
- `categories`: fixed select options: Development, Design, Testing, Documentation, and Other.
- `assignees`: suggestions for the datalist autocomplete: Alex, Sam, Taylor, and Jordan. The input is still free text, so these are suggestions rather than enforced values.

#### Component State and Refs

- `userId`: current authenticated user identifier. It is also the namespace used by the storage service.
- `entries`: complete in-memory list shown by the page.
- `form`: controlled values for all form fields.
- `editingId`: `null` while creating or the target entry ID while editing. It changes headings and submit/cancel button labels and decides whether submission calls `create` or `update`.
- `selectedIds`: a `Set<string>` containing table rows selected for bulk deletion.
- `listSearch`: current case-insensitive list filter text.
- `message`: success feedback rendered with `role="status"`.
- `error`: validation/load/save/delete feedback rendered with `role="alert"`.
- `fileInput`: direct reference used to clear the browser file input, which cannot be fully controlled like a text input.
- `formHeading`: heading reference used to scroll smoothly back to the editor after the user selects an entry to edit.

#### Initial Load

- A mount-only `useEffect` schedules its work with `window.setTimeout(..., 0)` and clears that timer during cleanup.
- The callback reads `getCurrentUser()?.id`. If no ID exists, it exits without loading entries.
- With a valid ID, it stores the ID in state and calls `practiceEntryService.list(id)`.
- Load failures display `Could not load practice entries from this browser.`.
- The timeout defers the state updates until after the immediate effect execution. The protected layout remains the primary authentication guard.

#### Search and Selection Derivations

- `visibleEntries` is calculated on every render from `entries` and `listSearch`.
- Search trims and lowercases the query and checks `title`, `reference`, `description`, `category`, and `assignee` with substring matching.
- An empty trimmed query matches every entry because every string includes the empty string.
- `hours`, `dueDate`, `rating`, status, filename, and timestamps are not searchable.
- `allVisibleSelected` is true only when at least one filtered row exists and every visible row ID is selected.
- Selection can span rows, but changing the search text intentionally resets `selectedIds` to an empty set.

#### Form Helper Functions

- `updateField(field, value)`: generic type-safe updater for any `PracticeForm` property; it also clears the current error.
- `clearForm()`: restores `emptyForm`, exits edit mode, clears the native file input, and clears errors. It does not clear a success message.
- `handleSubmit(event)`: prevents native form submission, validates and normalizes input, calls create/update, updates the entries state, displays success text, and resets the editor.
- `editEntry(entry)`: copies every editable property into the controlled form, records the entry ID, clears feedback, resets the physical file input, and scrolls the form heading into view.
- `deleteEntries(ids)`: confirms the action, calls the service, removes deleted rows from local state, resets selection, exits edit mode if its target was deleted, and reports singular or plural success text.
- `toggleSelected(id)`: clones the current `Set` before adding or removing one ID, preserving React's immutable-state update pattern.
- `toggleAllVisible()`: selects all currently filtered rows or removes all visible rows from the selection while leaving any non-visible selections unchanged.

#### Submission Validation and Normalization

- Required by component validation: nonblank title, due date, category, nonblank hours, numeric finite hours from 0 through 100, and rating of at least 1.
- Required by native HTML attributes: title, hours, category, and due date. The rating buttons require the explicit component check because they are not native required inputs.
- `hours` uses a numeric input with `min="0"`, `max="100"`, and `step="0.5"`; the submit handler converts its string value using `Number`.
- Maximum lengths: title 120, reference 100, description 1000, and assignee 80 characters.
- Before persistence, title, reference, description, and assignee are trimmed. Category, due date, filename, completion state, and rating are used as selected.
- Failed validation shows `Complete the required fields and choose a rating from 1 to 5.`.
- The service is called only when a user ID is available; otherwise the page asks the user to sign in again.
- Create success prepends the returned row to state. Update success replaces the matching row while retaining list order.

#### Form Controls Demonstrated

- Text input: required title.
- Number input: required hours.
- Search input: optional reference keyword.
- Select: required category.
- Textarea: optional description.
- Text input plus `datalist`: optional assignee autocomplete.
- Date input: required due date.
- File input: optional attachment selection.
- Rating control: five ordinary buttons with `aria-pressed`; the selected rating highlights that star and every star before it.
- Checkbox: completion status.
- Submit and reset/cancel buttons whose wording changes between create and edit modes.
- Important file behavior: only `File.name` is copied into `fileName`; file bytes, MIME type, path, and upload data are never stored or transmitted. Selecting a file does not upload it.

#### Saved Entries Table

- Displays a total count based on all entries, not only filtered entries.
- Provides bulk delete with a live selected count and disables the button when nothing is selected.
- Provides select-all for currently visible entries and one checkbox per row.
- Columns: selection, entry details, category, hours, due date, rating, status, and actions.
- Entry details show title, assignee or `Unassigned`, optional reference, and an expandable `<details>` area for description and saved attachment name.
- Status is presented as a green `Completed` badge or gray `Open` badge.
- Each row has Edit and Delete buttons.
- Empty-state wording distinguishes an entirely empty list from a search that has no matches.

#### Accessibility and Responsive Behavior

- Sections use `aria-labelledby` and stable heading IDs.
- Feedback uses status/alert roles.
- Rating buttons expose an accessible star count and pressed state.
- Selection inputs have contextual `aria-label` values, and rating cells expose `x out of 5 stars`.
- Form labels are connected to inputs through `htmlFor`/`id`.
- Bootstrap's responsive grid changes paired controls from half-width columns to full width on smaller screens.
- The table is wrapped in `.table-responsive` to allow horizontal scrolling on narrow viewports.

#### Dependencies, Usage, and Limitations

- Depends on: React, `ProtectedLayout`, `src/lib/auth.ts`, `src/models/PracticeEntry.ts`, `src/services/practice-entry-service.ts`, Bootstrap classes, and browser APIs.
- Used by: Next.js directly as the `/form-practice` route; reached through the Navbar link.
- No network request, API client, server action, database query, or upload endpoint is involved.
- Search and CRUD operations are synchronous and local to the browser.
- The page catches storage/service errors but displays generalized messages rather than the original error details.
- The list is not explicitly sorted after load; service storage order is used. Newly created items are prepended, while edits retain position.
- There is no schema validation for older or manually modified stored JSON beyond checking that the parsed root is an array.

### [src/components/ui/Navbar.tsx](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/components/ui/Navbar.tsx>) — Current Form Practice Integration

- Purpose in this feature: makes `/form-practice` discoverable from every authenticated page that renders `ProtectedLayout`.
- The current code adds a `Form Practice` `Link` after Notes.
- Active-state behavior for this link uses an exact comparison: `pathname === '/form-practice'` produces `nav-link active`; otherwise it produces `nav-link`.
- Because the feature currently has only one route, exact matching is sufficient. A future nested route such as `/form-practice/create` would not be marked active without changing this logic.
- The link uses Next.js `Link`, so navigation is a client-side route transition rather than a forced full document reload.

#### Complete Navbar Behavior Relevant to the Four-File Flow

- `'use client'` is required for navigation hooks, local state, browser auth helpers, and click handling.
- `usePathname` supplies the current URL for active link classes.
- `useRouter` is used to navigate to `/login` after logout.
- User state is lazily initialized with `getCurrentUser()` so stored auth data is read when the component initializes.
- If no user exists, the component returns `null`, so neither Form Practice nor any other navigation is shown.
- `handleLogout` clears auth data through `logout`, sets the Navbar user state to `null`, and pushes `/login`.
- `isActive` applies exact active matching to the regular Dashboard and Notes links. Daily Logs has a dropdown, although its top-level active comparison currently matches only `/dailylogs`, not its create/search subroutes.
- Bootstrap's collapse and dropdown data attributes depend on the client-loaded Bootstrap JavaScript bundle.
- Depends on: `next/link`, `next/navigation`, React state, `src/lib/auth.ts`, `src/models/User.ts`, Bootstrap styling/behavior, and indirectly `BootstrapClient`.
- Used by: `ProtectedLayout`, and therefore all authenticated feature pages including Form Practice.

### [src/models/PracticeEntry.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/models/PracticeEntry.ts>)

- Purpose: compile-time data contract shared by the page and local persistence service.
- `PracticeEntry` represents a complete stored record.
- Field definitions:
  - `id: string`: unique record identifier generated during creation.
  - `title: string`: required entry name.
  - `hours: number`: normalized numeric effort value.
  - `reference: string`: optional-style searchable keyword stored as a string, including an empty string when omitted.
  - `description: string`: details text, also stored as an empty string when omitted.
  - `category: string`: selected category label.
  - `assignee: string`: free-text assignee, possibly empty.
  - `completed: boolean`: open/completed flag.
  - `dueDate: string`: HTML date value in `YYYY-MM-DD` form.
  - `fileName: string`: filename only; it is not a file or URL.
  - `rating: number`: page-generated value from 1 through 5 for valid newly submitted data.
  - `createdAt: string`: ISO timestamp assigned on creation.
  - `updatedAt: string`: ISO timestamp assigned on creation and refreshed on update.
- `PracticeEntryInput` uses `Omit<PracticeEntry, 'id' | 'createdAt' | 'updatedAt'>`, ensuring callers supply business fields while the service owns identity and timestamps.
- The interfaces do not perform runtime validation and do not exist after TypeScript compilation.
- The model has no `userId` field because user ownership is represented by the per-user storage key rather than duplicated in each entry.
- Depends on: TypeScript only.
- Used by: `src/app/form-practice/page.tsx` and `src/services/practice-entry-service.ts`.

### [src/services/practice-entry-service.ts](<D:/Personal/Office Dialy General Task/Front-End/office-developer-journal/src/services/practice-entry-service.ts>)

- Purpose: synchronous browser-local repository/service for Form Practice entries.
- Exports: singleton-style `practiceEntryService` object with `list`, `create`, `update`, and `delete` methods.
- Depends on: `PracticeEntry`, `PracticeEntryInput`, `window.localStorage`, `JSON`, `Date`, `crypto.randomUUID`, and `Set`.
- Used by: `src/app/form-practice/page.tsx`.
- It deliberately does not import `apiClient`; therefore none of its operations reach the backend.

#### Seed Data

- `seedEntries` contains two complete examples: `sample-1` (`Review dashboard layout`) and `sample-2` (`Try a new API request`).
- The examples demonstrate populated and empty optional values, completed/open states, decimal hours, filenames, ratings, and ISO timestamps.
- Seed records are returned only when the per-user storage key is completely absent (`getItem` returns `null`).
- Seed entries are shallow-cloned before being returned so callers do not receive the exact module-level seed objects.
- The initial seed list is not automatically written to storage. The first create, update, or delete operation writes the resulting list.
- An intentionally stored empty array remains empty and does not cause seed data to reappear.

#### Storage Key and User Isolation

- `storageKey(userId)` produces `journal-form-practice:<userId>`.
- Each user ID therefore gets an independent entry array in the same browser origin.
- This is client-side namespacing, not a security boundary: a user with browser developer tools or injected script can inspect or modify all localStorage keys.
- Logout does not remove these practice-entry keys, so data remains in the browser and reappears when the same user ID signs in again.
- Storage remains specific to the browser profile, device, protocol, host, and port; it does not synchronize across devices.

#### Private `read` and `write` Helpers

- `read(userId)` gets the user-specific JSON string.
- When no value exists, it returns shallow copies of both seed entries.
- When a value exists, it parses JSON into `unknown`, checks only `Array.isArray`, and casts the array to `PracticeEntry[]`.
- Invalid JSON and parse failures are converted to an empty array rather than propagated.
- Valid JSON with malformed entry objects passes through because there is no per-field runtime schema validation.
- `write(userId, entries)` serializes the complete array and replaces the storage value with `localStorage.setItem`.
- `localStorage` quota/security errors from `getItem` or `setItem` can propagate to the page, where the surrounding CRUD/load handlers show user-friendly error messages.

#### CRUD Methods

- `list(userId)`: returns `read(userId)` with no additional sorting, filtering, or mutation.
- `create(userId, input)`:
  - Generates one ISO timestamp for both `createdAt` and `updatedAt`.
  - Generates the ID with `crypto.randomUUID()`.
  - Builds a complete `PracticeEntry` from the input plus service-owned fields.
  - Prepends the new record to the currently read list and writes the full list.
  - Returns the created record for immediate UI insertion.
- `update(userId, id, input)`:
  - Reads the current list and finds the requested ID.
  - Throws `The entry could not be found.` if the ID is absent.
  - Merges the existing entry, then all input fields, then a fresh `updatedAt`; this preserves `id` and `createdAt`.
  - Replaces only the matching array item, writes the full array, and returns the updated record.
- `delete(userId, ids)`:
  - Converts IDs to a `Set` for efficient membership tests.
  - Reads the list, filters out all selected IDs, and writes the remaining array.
  - Unknown IDs are ignored, so deleting them is effectively a no-op apart from rewriting storage.
  - Supports both single-row and bulk deletion through the same method.

#### Service Characteristics and Risks

- Calls are synchronous, so there are no promises, loading requests, retries, cancellation, or network error types.
- Every mutation performs a read-modify-write of the complete entry array. This is simple but becomes slower and consumes more memory as the list grows.
- Concurrent edits in multiple tabs can overwrite one another because there is no locking, version check, merge strategy, or `storage` event synchronization.
- `crypto.randomUUID()` requires a compatible browser and secure context in normal web usage; there is no fallback ID generator.
- Client clocks determine timestamps, so they are not authoritative server audit values.
- No storage migration/versioning exists if the entry shape changes later.
- No sanitization is performed in the service. React safely escapes values in ordinary JSX rendering, but future raw HTML rendering would require separate protection.

### End-to-End Execution Flow for Form Practice

1. An authenticated user selects `Form Practice` in `Navbar`.
2. Next.js performs a client-side transition to `/form-practice` and mounts `FormPracticePage` within `ProtectedLayout`.
3. The mount effect reads the user from browser auth storage and obtains the user ID.
4. `practiceEntryService.list(userId)` reads `journal-form-practice:<userId>`; absent storage produces cloned seed entries.
5. The page stores the entries in React state and renders the searchable table.
6. The user changes controlled inputs; `updateField` updates `form` state.
7. Submission prevents a page reload, validates required values, converts hours to a number, trims selected strings, and creates a `PracticeEntryInput`.
8. Create or update writes the complete user-scoped array to localStorage and returns the resulting entry.
9. The page mirrors the result into `entries`, resets the editor, shows success feedback, and re-renders.
10. Search filters the in-memory array only; it does not alter persisted data.
11. Edit copies one stored entry back into the form. Delete confirms first, removes one or many IDs from storage, and synchronizes page state.

### Data Lifecycle and CRUD Matrix

| Operation | UI entry point | Service method | Persistent effect | Page-state effect |
| --- | --- | --- | --- | --- |
| Read | Page mount | `list(userId)` | None | Replaces `entries` with stored or seeded data |
| Create | `Save entry` | `create(userId, input)` | Prepends and stores a new UUID/timestamped entry | Prepends returned entry |
| Update | `Edit` then `Save changes` | `update(userId, id, input)` | Replaces matching entry and refreshes `updatedAt` | Replaces matching row in place |
| Delete one | Row `Delete` | `delete(userId, [id])` | Removes matching ID after confirmation | Filters matching row |
| Delete many | `Delete selected` | `delete(userId, ids)` | Removes every selected ID after confirmation | Filters rows and clears selection |
| Search | Search saved entries | None | None | Derives `visibleEntries` without changing `entries` |

### Important Maintenance Notes

- The earlier sections that list application routes, frontend models, services, CRUD behavior, and features should now be read together with this section; the Form Practice route, `PracticeEntry` model, and localStorage service are additional current project elements.
- `PracticeEntry` is a frontend persisted object but not a database entity in this repository.
- Form Practice differs from Daily Logs and Notes because it never contacts the backend, and it differs from Standups because it survives refreshes through localStorage.
- Clearing site data, changing browser/profile/origin, or manually deleting the `journal-form-practice:<userId>` key removes saved entries; the next read then shows seed entries again.
- Because the service is browser-only, importing or invoking it during server rendering would fail. Its current caller is correctly marked as a client component and invokes the service after mount or from event handlers.
- Recommended future improvements include runtime schema validation, storage versioning/migration, cross-tab synchronization, tests for validation and CRUD, an ID fallback if older browsers matter, and backend persistence if data must be secure or available across devices.

## 13. Notes Board UI and Multi-Note Compatibility Update

This section supersedes the earlier single-textarea Notes description. The Notes feature now presents multiple sticky-note cards and a large selected-note editor while continuing to use only the existing `GET /Notes` and `PUT /Notes` endpoints.

### Existing Endpoint Compatibility

- The backend still exposes one note resource shaped as `{ id, content, updatedAtUtc }`.
- No new create, list, update-by-ID, or delete endpoint was added or assumed.
- Multiple frontend notes are stored as a versioned JSON document inside the existing `content` string.
- The JSON document uses `format: "developer-journal-notes-board"`, `version: 1`, and a `notes` array.
- Frontend create, update, and delete operations modify that array and persist the complete document through the existing `PUT /Notes` request.
- Existing plain-text content is not discarded. The parser converts it into one yellow sticky note named `Imported note`; it is written in board format after the user next changes the board.
- Empty existing content produces an empty board.
- A failed initial GET cannot trigger an empty PUT because the page now enables autosave only after a successful load.

### Updated `src/models/Note.ts`

- The original backend `Note` interface remains unchanged.
- `NOTE_COLORS` defines the supported sticky colors: yellow, peach, mint, blue, and lavender.
- `NoteColor` derives a string-literal union from that constant.
- `StickyNote` defines client-side note ID, title, content, color, pinned state, creation time, and update time.
- `NotesBoard` defines the versioned document stored in the backend note's `content` property.
- These board types are frontend persistence contracts; they do not require matching backend database columns.

### Updated `src/services/note-service.ts`

- Existing `getNote()` and `saveNote(content)` methods remain available and still call `GET /Notes` and `PUT /Notes`.
- `parseNotesBoard(content)` safely recognizes the marked version-1 board format.
- Parsed entries are normalized so missing optional client fields get safe defaults; malformed array entries without string IDs are dropped.
- Unrecognized JSON is treated as legacy text instead of being destroyed.
- `serializeNotesBoard(board)` converts the board to the string accepted by the current endpoint.
- `getNotesBoard()` loads the backend note and returns a parsed board.
- `saveNotesBoard(board)` serializes the board, saves it through the existing endpoint, and parses the returned content.
- IDs use `crypto.randomUUID()` when available and a timestamp/random fallback otherwise.

### Updated `src/app/notes/page.tsx`

- The route remains `/notes`, stays protected by `ProtectedLayout`, and retains full-page mode.
- A left-side library displays multiple small sticky cards. Clicking a card opens it in the large editor.
- `New note` creates an empty note, selects it, clears search, and queues autosave.
- Users can give each note a title up to 100 characters and edit unrestricted text content.
- Search filters by both title and content without changing persisted data.
- Pinned notes sort before unpinned notes; each group sorts by most recently updated.
- Five color choices update both the small card and large editor appearance.
- Delete uses a confirmation dialog, removes the selected note, and selects the next available note.
- Empty, loading, and no-search-results states are handled separately.
- The editor shows word count and the note's formatted update timestamp.
- Autosave is debounced by 650 milliseconds.
- Saves are serialized through a promise queue so rapid edits do not intentionally launch parallel PUT operations.
- Save status reports loading, saving, saved, and error states through an `aria-live` region.
- The last loaded/saved serialization is tracked to avoid redundant requests.
- A mounted-state guard prevents async completions from updating an unmounted component.

### Updated Notes Styling in `src/app/globals.css`

- The Notes page now uses a two-column desktop layout: a compact card library and a large editor workspace.
- Sticky cards have color variants, short previews, active/focus outlines, subtle rotation, hover elevation, and timestamps.
- The large sheet matches the selected color and contains a toolbar, color swatches, title field, content editor, and metadata footer.
- The save indicator is a floating status pill with distinct neutral, saving, saved, and error colors.
- At tablet/mobile widths the layout becomes a single column with the card library above the editor.
- On very small screens the card grid becomes one column and editor controls stack vertically.
- Labels, pressed states, visible focus states, live status, semantic sections, and empty-state messaging support keyboard and assistive-technology use.

### Notes CRUD Flow With the Existing API

| User action | Frontend behavior | Backend request |
| --- | --- | --- |
| Load notes | Parse the single content string into a board | `GET /Notes` |
| Create note | Add a `StickyNote` to the board array | Debounced `PUT /Notes` with serialized board |
| Read/select note | Select a local card and show its large editor | None |
| Update title/content/color/pin | Replace fields in the selected array item | Debounced `PUT /Notes` with serialized board |
| Delete note | Remove the selected array item after confirmation | Debounced `PUT /Notes` with serialized board |
| Search notes | Filter the loaded array in browser memory | None |

### Important Constraint

- This design works with the existing endpoint as long as the backend/database permits a sufficiently large `content` value and returns the saved content unchanged. Because the entire board is one backend record, there is no server-side per-sticky-note querying, independent authorization, partial update, or conflict detection. A dedicated multi-note backend would be preferable if the board becomes large or needs collaborative editing.
