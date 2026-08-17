# Plan: Enhancements to Monetization Audit and E2E Testing

Implementing security validation, idempotency testing, and enhanced administrative visibility for the Mercado Pago integration.

## Database Schema Changes
- Add `error_message`, `processed_by_user_id`, and `failure_reason` columns to `webhook_events` table for better traceability.
- Add `GRANT` statements to ensure `authenticated` users with `admin` role can access these new fields.

## Webhook Enhancements
- Update `src/routes/api/public/webhook.ts` to populate the new fields during processing.
- Ensure the idempotency check returns a clear "Already processed" signal that can be verified in tests.

## Admin UI Improvements
- Update `src/routes/admin/index.tsx` "Webhook Events" tab:
    - Add "Usuário" (external_reference) and "Motivo" (status/error) columns.
    - Implement a "Details" side panel or expandable row to show the full JSON payload.
    - Standardize icon usage for success/failure states.

## E2E Testing Strategy
- Create `/tmp/browser/monetization/test_webhook_security.py` using Playwright:
    1. **Idempotency Test**: 
        - Setup: Ensure a test user exists.
        - Step 1: Send a valid mock webhook for `payment_id_1`.
        - Step 2: Verify expiration updates in the UI.
        - Step 3: Re-send the exact same webhook payload/headers.
        - Verification: Verify expiration date has NOT changed (confirming it wasn't extended twice).
    2. **Invalid Signature Test**:
        - Step 1: Send a webhook with a valid-looking payload but an intentionally incorrect `x-signature`.
        - Verification: Confirm the request is rejected (401) and the UI reflects no change in license status.

## Technical Details
- Use `crypto.createHmac` in the test script to generate valid signatures (simulating Mercado Pago) when needed for the idempotency test.
- Use `page.evaluate` to trigger server functions if needed for setup, or use direct API calls to the webhook endpoint.
- Verify changes in the `profiles` table `license_expires_at` column via the UI settings page.
