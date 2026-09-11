# Larries Secondhand Clothing

A small site for the school clothing store: parents submit secondhand items for sale, an
admin approves them, and buyers browse the approved list. Replaces tracking availability
in a WhatsApp group.

- **Buyers** browse `/`, filter by item + size, and contact the seller in the WhatsApp group.
- **Sellers** submit items at `/sell` and manage their own listings at `/my-items` (looked up
  by the phone number they submitted with — never shown publicly).
- **Admins** approve/reject submissions and manage the item-type list at `/admin`, gated by a
  magic-link email (no passwords, no OAuth setup).

## Stack

- Next.js (App Router) on Render
- Postgres on Neon, accessed with plain `pg` (no ORM)
- Resend for the admin magic-link email and new-submission notifications

## Local setup

1. `npm install`
2. Create a Postgres database and run the schema once:
   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```
   This also seeds a starting list of item types — edit the `insert into item_types` block
   in `db/schema.sql`, or manage them from the admin dashboard, or edit the table directly.
3. Copy `.env.example` to `.env` and fill in the values (see below).
4. `npm run dev`

## Environment variables

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Neon connection string (use the pooled connection string Neon gives you) |
| `RESEND_API_KEY` | From your Resend dashboard |
| `RESEND_FROM` | Sender address; must be a domain verified in Resend, or use their `onboarding@resend.dev` for testing |
| `ADMIN_EMAILS` | Comma-separated allowlist of emails allowed into `/admin`. The first one also receives new-submission notifications |
| `AUTH_SECRET` | Long random string signing admin session/login tokens — generate with `openssl rand -base64 32` |
| `APP_URL` | The site's public URL (used to build the magic-link email) |

## Deploying (Render)

1. Push this repo to GitHub.
2. In Render, create a new Web Service from the repo — build command `npm run build`, start
   command `npm start`.
3. Add the environment variables above in the Render dashboard.
4. Run `db/schema.sql` against your Neon database (once) before first use.
