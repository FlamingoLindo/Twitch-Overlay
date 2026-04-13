# Twitch Overlay

OBS browser capture overlay

<img width="2554" height="1155" alt="Image" src="https://github.com/user-attachments/assets/bff20d53-7f2d-4103-9507-9f0c9f0c6311" />

It runs a Next.js app with a custom Node HTTP server (so Socket.IO can share the same port), stores overlay items in Postgres via Prisma, and syncs changes in real-time between connected clients.

## What it does

- Create draggable **text** items.
- Create draggable **image** items (stored as a Data URL).
- Move/resize items and persist their position/size.
- Sync create/move/update/delete events live using Socket.IO.

## Tech stack

- Next.js (App Router) + React
- Socket.IO (server + client)
- Prisma + Postgres
- Tailwind CSS

## Requirements

- Node.js (recommended: 20+; the Dockerfile uses Node 24)
- A Postgres database (local or via Docker)

## Environment variables

Create a `.env` file in the project root.

Minimum required:

```bash
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/twitch_overlay?schema=public"
```

If you use `docker compose` for Postgres, you typically also set:

```bash
POSTGRES_DB=twitch_overlay
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<password>

# When running the app container inside Docker, DATABASE_URL usually points at the db service:
# DATABASE_URL="postgresql://postgres:<password>@db:5432/twitch_overlay?schema=public"
```

## Local development

Install dependencies:

```bash
npm install
```

Generate Prisma client (required because it outputs to `app/generated/prisma`):

```bash
npx prisma generate
```

Apply migrations to your dev database:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

Open:

- <http://localhost:3000>

Notes:

- The custom server currently listens on port `3000` (hard-coded in `server.ts`).
- Click the "Add" button to create text or an image.

## Docker (standalone Next.js build)

This repo includes a production-style setup:

- Builds Next.js with `output: "standalone"`.
- Runs `prisma migrate deploy` on container start.

Bring everything up:

```bash
docker compose up --build -d
```

Open:

- App: <http://localhost:3001>
- Adminer (DB UI): <http://localhost:8081>

## Use in OBS

Add a **Browser Source** pointing to your running app URL:

- Local dev: `http://localhost:3000`
- Docker: `http://localhost:3001`

## API

The UI talks to the API routes under `app/api`.

- `GET /api` returns all items.
- `POST /api` creates an item.
  - Text payload: `{ type: "text", x, y, text, fontSize }`
  - File payload: `{ type: "file", x, y, path, width, height }`
- `PATCH /api/:id` updates coordinates and either `fontSize` (text) or `width/height` (file).
- `DELETE /api/:id` deletes the item.

## Real-time events

Socket.IO broadcasts updates to other connected clients:

- `item:create`
- `item:move`
- `item:update`
- `item:delete`

## Data model

Prisma models are defined in `prisma/schema.prisma`:

- `Item` holds `type`, `x`, `y`
- `TextItem` holds `text`, `fontSize`
- `FileItem` holds `path`, `width`, `height`

## Important notes

- Image "uploads" are stored as Data URLs (`file.path`) and saved in Postgres. This is convenient for prototyping, but it can make the database grow quickly for large images.
- There is no authentication/authorization; anyone with access to the app can edit the overlay.
