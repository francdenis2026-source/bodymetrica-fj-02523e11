# Plan - Authentication, Logout, and Professional Overlays

## Summary
The goal is to fix the logout button, implement a functional registration system (simulated for now, with UI flow), restrict access to authenticated users, and add professional SVG-based overlays/messages when trying to access restricted areas.

## Proposed Changes

### 1. Authentication & Security
- **Auth Guard**: Update `src/routes/__root.tsx` to handle authentication state.
- **Access Control**: Restrict access to dashboard and other internal routes if not logged in.
- **Mock Auth Service**: Expand `src/lib/auth/auth.functions.ts` to include `logout` and `register`.
- **LocalStorage Persistence**: Use `localStorage` to persist the mock session.

### 2. UI/UX Refinements
- **Logout Fix**: Connect the "SAIR" button in `src/routes/__root.tsx` to the `logout` function.
- **Registration Flow**: Link the onboarding "Começar Agora" button to a registration completion step.
- **Professional Overlays**: Create a reusable `AccessGate` component or logic that shows a sophisticated SVG-based message when access is restricted.
- **SVG Graphics**: Use custom SVGs for "Access Denied" or "Login Required" states to maintain a premium aesthetic.

### 3. Navigation
- Ensure "/" (Home) and "/auth" remain public.
- All other routes should redirect to "/auth" if no session exists.

## Technical Details

### Auth Logic
```typescript
// Proposed storage keys
const AUTH_KEY = 'bodymetrica_auth_session';
```

### Components
- `AccessOverlay`: A full-screen or component-level overlay with a blurred background, primary-gradient accents, and a high-quality SVG illustration.

## User Review Required
> [!IMPORTANT]
> The authentication will be simulated (mock session in localStorage) since a full backend is not yet integrated. Is this acceptable for the current stage?
