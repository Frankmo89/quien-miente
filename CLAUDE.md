# CLAUDE.md - Rules & Architecture for "Quién Miente?"

## 1. Core Philosophy & Quality Standards
- **Mobile-First Perf:** We are building a Capacitor app, not a website. Animations must be 60fps native-like.
- **Offline-First:** The game must function 100% without internet after asset download.
- **Zero Friction:** No email sign-up required. Purchases persist via Device Keychain.
- **Anti-Spoiler UX:** Strict visual distinction between "Public View" (Group) and "Private View" (Secret Role).

## 2. Tech Stack & Decisions
- **Framework:** React 19 (use React Compiler features).
- **Build Tool:** Vite + Capacitor v6.
- **Styling:** TailwindCSS 4.
  - *Rule:* ONLY animate `transform` and `opacity`. Never animate layout properties (width, height, top).
- **State Management:** React Context + Hooks (Keep it simple, minimal re-renders).
- **Backend/API:** tRPC (strictly for content syncing, NOT for game logic which is local).
- **Payments:** **RevenueCat** (Replace current Stripe web implementation).
- ****Persistence:** capacitor-secure-storage-plugin(for syncing purchases) +SQLiteor optimizedIndexedDB for game content.
## 3. Development Commands
- `pnpm dev`: Start web dev server.
- `pnpm build`: Production build.
- `pnpm cap sync`: Sync changes to native iOS/Android projects.
- `pnpm test`: Run Vitest suite.

## 4. Coding Guidelines for Agents
- **Strict Typing:** No `any`. Use strict Zod schemas for all game state.
- **Plan Mode:** ALWAYS propose a detailed plan before modifying code.
- **Component Structure:**
  - `components/ui`: Dumb components (Shadcn/Tailwind).
  - `features/[feature]`: Domain logic (e.g., `features/game-loop`, `features/store`).
- **Optimization:**
  - Use `<VirtualList>` for any list > 50 items.
  - Implement `@capacitor/haptics` on all major interactions (button taps, role reveal).

## 5. Critical Constraints (Do Not Break)
- **NO STRIPE JS:** Do not use Stripe.js for the mobile build. Use RevenueCat SDK.
- **NO LOCALSTORAGE FOR PURCHASES:** Purchases must be secure.
- **LANGUAGE:** All UI text must be **Latin American Spanish** (es-419).