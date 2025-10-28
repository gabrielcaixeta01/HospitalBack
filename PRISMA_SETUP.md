# Postgres + Prisma — Local setup notes

These are minimal notes to get Prisma working with the Docker Postgres in this repository.

1. Start Docker Compose (container `hospital_db` and `hospital_pgadmin`):

```bash
docker compose up -d
```

2. The project expects a `DATABASE_URL` environment variable. Example value used in this repo:

```text
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/hospital_db?schema=public"
```

Use `127.0.0.1` on macOS to avoid IPv6/`localhost` resolution conflicts.

3. Generate Prisma client and push schema:

```bash
npx prisma generate --schema prisma/schema.prisma
npx prisma db push --schema prisma/schema.prisma
```

4. If you have Homebrew Postgres running on port 5432, stop it before starting the container:

```bash
brew services stop postgresql@14
# (when done) brew services start postgresql@14
```

5. CI / production: set `DATABASE_URL` via environment variables instead of `.env` files.

Notes

- `prisma/.env` exists and is used by Prisma when loading the `prisma.config.ts` file. We added `import 'dotenv/config'` at the top of `prisma.config.ts` so `.env` values are available when Prisma loads its config.
- If you change the DB name, ensure the database actually exists in the Postgres instance (or create it with `CREATE DATABASE <name>;`).

That's it — these steps reproduce the quick workflow used during local development.
