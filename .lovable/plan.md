# Plan for Enhanced Physical Performance & Nutrition Management

The goal is to implement advanced comparison, notification, and planning features for the Body Métrica FJ suite, ensuring professional data management and insightful evolution tracking.

## User Review Required

> [!IMPORTANT]
> The "Plan Diário" (Daily Plan) will include a checklist for meals (Breakfast, Lunch, Dinner, Snacks). Should these meal timings be fixed or customizable in the initial version?

- **Comparison Drill-down**: The physical performance history will now support selecting two dates to see a side-by-side comparison of calories, macros, hydration, and weight.
- **Intelligent Reminders**: Expanding the notification engine to trigger specific meal and hydration alerts based on the user's current progress and scheduled times.
- **Daily Planning Screen**: A new interactive tab in the Nutrition module focused on daily macro distribution across specific meals with a progress checklist.
- **Automated Insights**: Implementing a logic engine that generates actionable recommendations (e.g., "Increase protein by 5% based on last week's muscle mass gain") within the comparison views.
- **Advanced Export**: Enhancing PDF/CSV exports to include the Month-over-Month comparison data, including percentage variations and trend charts.

## Technical Details

### Frontend & UI
- Update `src/routes/body/index.tsx` to include a "Compare Mode" in the performance history tab.
- Modify `src/routes/nutrition/index.tsx` to add the "Planejamento Diário" tab with `MealChecklist` components.
- Enhance glassmorphic cards in `VariationItem` to trigger detailed insight overlays.

### Business Logic & Libraries
- **`src/lib/notifications.ts`**: Implement `scheduleMealReminders` and `checkMealProgress` logic.
- **`src/lib/monthly-reports.ts`**: Update `generateMonthlyPDF` to include comparison tables and trend analysis.
- **`src/lib/export.ts`**: Add support for month-over-month comparison CSV generation.
- **`src/lib/insights.ts`**: Create a new utility to generate technical diagnostics based on evolution data.

### Database & Auth
- No schema changes required; using existing `safeLocalStorage` and Supabase auth for preference persistence.
- Ensure all new reports respect user permissions and license status.

### Verification Plan
- Use Playwright to verify "Compare Mode" correctly calculates differences between two selected data points.
- Manually trigger mock notifications to verify "behind schedule" alerts for meals.
- Validate generated PDF/CSV files to ensure all comparison metrics (%, trends) are present.
