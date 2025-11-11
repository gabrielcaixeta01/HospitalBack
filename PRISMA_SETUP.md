# Postgres + Prisma — Local setup notes (non‑Docker)

These notes explain how to run the project's database and Prisma locally without Docker (macOS / zsh).

1) Install and start Postgres (Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

2) Create database and ensure credentials match `.env` (this project uses `postgres:postgres` in `.env`)

```bash
# create DB (adjust name if you prefer 'hospital_db' instead of 'hospital')
psql -d postgres -c "CREATE DATABASE hospital OWNER postgres;"

# if user already exists, ensure its password matches the .env value
psql -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

3) Ensure `.env` contains the right `DATABASE_URL` (example):

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/hospital?schema=public"
```

4) Generate Prisma client and apply the schema

If you want to apply existing migrations (recommended for CI/production):

```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma migrate deploy --schema=prisma/schema.prisma
```

For a fast development sync (non-destructive in dev flow):

```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma db push --schema=prisma/schema.prisma
```

5) Start the Nest app

```bash
npm run start
```

Notes
- Use `127.0.0.1` in the URL to avoid potential IPv6/`localhost` resolution issues on macOS.
- If you change the database name, create it or update the `DATABASE_URL` accordingly.
- CI / production: set `DATABASE_URL` via environment variables rather than `.env` files.

If you want, I can also create a small setup script that automates steps 1–4 on macOS.
