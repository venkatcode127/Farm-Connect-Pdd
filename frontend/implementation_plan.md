# Full App‑Wide Language Refactor

## Goal
Replace every hard‑coded UI string in the FarmConnect frontend with the translation function `t('key')` so the UI instantly reflects the language selected in the global language selector.

## User Review Required
> **[!IMPORTANT]** This change touches **all JSX files** under `src/` (pages, components, utilities). It will:
- Add new translation keys to `src/i18n/translations.js` for any missing text.
- Update imports to use `useLanguage` where needed.
- Modify components to call `t('key')` instead of raw literals.
- Run a full build and visual sanity check.

Please confirm you want us to proceed with this bulk refactor, or let us know if you prefer a staged approach (e.g., page‑by‑page).

## Open Questions
- Do you have any custom UI strings (e.g., tooltips, toast messages) not yet in `translations.js` that you want pre‑populated?
- Should we generate translation keys automatically based on the existing English text (e.g., `common.save` → `common.save`), or would you prefer a custom naming scheme?
- Do you want us to run unit‑/integration tests after the refactor, or is a manual visual check sufficient?

## Proposed Changes
### 1. Scan & Identify
- Use `rg` to locate all literal strings in `src/**/*.jsx` that are not already wrapped with `t()`.
- Generate a list of candidate keys.

### 2. Add Missing Keys
- For each new string, create a key following the pattern `<section>.<identifier>` (e.g., `dashboard.title`, `orders.noOrders`).
- Append entries for all supported languages with the English text as a fallback.

### 3. Update Files
- Insert `import { useLanguage } from '../context/LanguageContext';` (or correct relative path) where missing.
- Replace every UI literal with `t('key')`.
- Ensure placeholders in inputs, button labels, aria‑labels, and tooltips are also translated.

### 4. Verify
- Run `npm run build` to ensure no syntax errors.
- Start the dev server (`npm run dev`) and manually toggle languages to confirm all text updates.
- Optionally run existing Jest tests.

## Verification Plan
- **Automated Build** – `npx vite build` should succeed.
- **Manual UI Check** – Open the app, switch between English, Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, Punjabi; verify no English remnants appear.
- **Optional Tests** – Execute `npm test` if a test suite exists.

---
*Implementation will be performed in batches (pages → components) to keep commits manageable.*
