# Plan - Body Métrica FJ: Security, Session & UX Refinement

Enhance the security architecture, session management, and visual polish of the Body Métrica FJ platform.

## Proposed Changes

### 1. Security & Authentication
- **Automated Tests**: Create a Playwright test suite (`/tmp/browser/security_audit.py`) to validate:
    - RLS policies (unauthenticated users cannot read/write data).
    - Route protection (restricted routes redirect to `/auth`).
    - Permission isolation between users.
- **Cross-Tab Logout**: Implement a broadcast channel in `src/lib/auth/auth.functions.ts` to sync logout state across all open tabs, ensuring immediate redirection when one session ends.
- **Verification Page**: Create `src/routes/auth/verify.tsx` as a dedicated landing for email verification status, with options to resend the confirmation link.
- **Access Gate Refinement**: Update `AccessGate` to specifically handle the "verification required" state without immediately redirecting, allowing the user to trigger a resend.

### 2. Homepage & UI Refinement
- **Hero Image Upgrade**: Replace the current hero background with a more professional, high-impact fitness/medical-tech visual.
- **Floating Button Removal**: Clean up the homepage UI by removing distracting floating elements to achieve a more "military-grade" professional aesthetic.
- **Visual Polish**: Adjust spacing and typography in the Hero section to improve hierarchy and focus on the "Performance & Results" message.

### 3. Session & Data Synchronization
- **Real-time Session Monitoring**: Update `RootComponent` to listen for Supabase auth state changes directly, ensuring the UI reacts instantly to expiration or external logouts.

## Technical Details

- **Supabase Auth Listener**: `supabase.auth.onAuthStateChange` in `src/routes/__root.tsx`.
- **Broadcast Channel API**: Used in `clearSession` to notify other tabs.
- **Playwright Audit**: Will use the `lovable auth-session` capability to simulate multiple user contexts.

## User Review Required

> [!IMPORTANT]
> I will replace the current Unsplash hero image with a more minimalist, professional one. Do you have a specific visual style in mind (e.g., more clinical/scientific vs. more intense/athletic)? I'll proceed with a "High-Tech Performance" aesthetic.
