# Authentication and Profile Enhancements Plan

Implementing professional profile management, enhanced security features, and e-mail verification flow.

## User Interface

### 1. Profile Page (`/profile`)
- **Basic Data:** View and edit name, CPF (formatted), birth date, goal, weight, height, and activity level.
- **Security Section:** Dedicated "Change Password" flow requiring current password validation.
- **Active Sessions:** List current active devices/sessions with the ability to "Logout from other devices" using Supabase.
- **Visual Style:** Consistent "Deep Night" aesthetic with high-contrast typography and SVG feedback.

### 2. Login & Security
- **Rate Limiting:** Implement client-side backoff for failed login attempts (already partially exists, will be refined with better UX).
- **Verification UI:** A dedicated e-mail verification reminder page for unconfirmed accounts.
- **Toasts:** All feedback (success/error) will use the professional `SVGToast` component.

## Technical Details

### 1. Database & Server Functions
- **`src/lib/auth/auth.functions.ts`:**
  - `updateProfile`: Server function to update `profiles` table.
  - `changePassword`: Server function using `supabase.auth.updateUser` (requires current password verification step).
  - `listSessions` / `logoutOthers`: Manage active auth sessions.
  - `login`: Enhance with rate limit checking logic (server-side if possible, otherwise client-side persistence).

### 2. Verification Flow
- **Supabase Auth:** Ensure `email_confirmed_at` check is enforced in `login` handler.
- **Redirects:** Users with unverified e-mails will be redirected to `/auth/verify` with options to resend the verification link.

### 3. Navigation
- Add "Profile" link to the Sidebar and Dashboard headers.
- Link "Dados Pessoais" in Settings to the new Profile page.

## Implementation Steps

1.  **Update `auth.functions.ts`**: Add profile management and password change server functions.
2.  **Create `/profile` Route**: Implement the multi-section profile management UI.
3.  **Refine Login Flow**: Strengthen rate limiting and enforce e-mail verification check.
4.  **Create `/auth/verify` Route**: A professional landing page for e-mail confirmation status.
5.  **Integration**: Connect Settings and Sidebar links to the new profile page.
