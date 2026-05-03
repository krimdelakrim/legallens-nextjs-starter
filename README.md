# LegalLens Bankruptcy Research App - Next.js Starter

Private litigation research app scaffold replacing the Google Sheets prototype.

## Stack
- Next.js App Router
- Supabase Auth
- Supabase Postgres
- Supabase private Storage bucket
- Row Level Security policies

## Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in values.
4. Install and run:

```bash
npm install
npm run dev
```

5. Open `http://localhost:3000`.

## Current MVP
- Login/signup
- Protected routes
- Case list
- Upload pleading file to private Supabase Storage
- Create case and pleading records
- Parser placeholder for intake/significant lines

## Next build step
Replace the OCR placeholder in `app/upload/actions.ts` with Google Document AI, AWS Textract, or another OCR backend.
