# Plan - Body Métrica FJ

Professional PWA for body composition, nutrition, hydration, supplementation, and training.

## 1. Core Architecture & Design
- [ ] Set up project color palette in `src/styles.css` (Teal/Deep Blue, Vibrant Green, Controlled Orange).
- [ ] Implement responsive layout in `src/routes/__root.tsx` with mobile-first navigation (bottom nav) and desktop sidebar.
- [ ] Create a sophisticated landing page at `src/routes/index.tsx`.

## 2. Authentication & Provisioning
- [ ] Implement login/signup UI with CPF (masked) and 6-digit PIN.
- [ ] Prepare `src/lib/auth.functions.ts` for future Supabase integration.
- [ ] Add `/admin/login` for administrative access.
- [ ] Set up initial provisioning logic (placeholder for server-side execution).

## 3. Features - Client Side
- [ ] **Onboarding**: Multi-step flow for profile setup (goals, measurements, activity).
- [ ] **Dashboard**: Personal summary (goals, water, next meal/supp, training).
- [ ] **Body Metrics**: Weight, measurements (circ), fat %, muscle mass, and photo evolution.
- [ ] **Hydration**: Daily target, quick log, circular progress.
- [ ] **Supplementation**: Inventory management, logs, schedules.
- [ ] **Nutrition**: Meal planning, macro distribution, Brazilian/regional food options, allergies filter.
- [ ] **Training**: Workout logs, exercises, sets, reps, load tracking, RPE/RIR.
- [ ] **Reports**: Visualized progress (PDF export capability).

## 4. Features - Admin Side
- [ ] **Admin Hub**: User management, protocol configuration (supplements/exercises), audit logs.
- [ ] **Database Management**: CRUD for foods, exercises, and recipes.

## 5. Technical Preparation (Supabase Ready)
- [ ] Create `supabase/migrations/` for all tables (profiles, body_records, meal_plans, etc.).
- [ ] Implement RLS policies in SQL.
- [ ] Use mock data services in `src/lib/api/` to allow development without a live DB.
- [ ] Environment variable documentation (`.env.example`).

## 6. Polish & PWA
- [ ] Implement light/dark mode.
- [ ] Add PWA manifest and icons.
- [ ] Visual audit: consistency in spacing, typography, and contrast.

## Technical Details
- **Framework**: TanStack Start v1 (React 19).
- **Styling**: Tailwind CSS v4.
- **Components**: shadcn/ui.
- **State/Data**: TanStack Query + TanStack Router Loaders.
- **Security**: CPF validation, PIN brute-force protection logic (mocked), PII masking.
