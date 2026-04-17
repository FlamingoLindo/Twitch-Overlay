# Twitch Overlay

OBS browser overlay for shared text and image elements.

<img width="2559" height="1439" alt="Twitch Overlay preview" src="https://github.com/user-attachments/assets/ec1a0b0b-4ebe-4fe5-9936-294473b8b289" />

The app uses a custom Node HTTP server so Next.js and Socket.IO share the same port, stores overlay items in Postgres through Prisma, and keeps connected clients in sync in real time.

## Features

- Create draggable text items.
- Create draggable image items from uploaded files.
- Move and resize items, then persist those changes.
- Toggle item visibility so only visible items render on the overlay page.
- Broadcast create, update, visibility, and delete events with Socket.IO.

## Stack

- Next.js 16 App Router
- React 19
- Socket.IO
- Prisma + Postgres
- Tailwind CSS v4

## Requirements

- Node.js 20 or newer. The Docker image uses Node 24.
- Postgres, either local or via Docker.

## Environment

Create a `.env` file in the project root.

```bash
POSTGRES_DB=overlay
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

DATABASE_URL="postgresql://postgres:password@db:5432/overlay?schema=public"

TTV_CHANNEL=your_twitch_username
DOMAIN_NAME=your.overlay.url.com
```

## Local Setup

Install dependencies:

```bash
npm install
```

Generate the Prisma client. This project outputs it to `app/generated/prisma`:

```bash
npx prisma generate
```

Apply migrations to your development database:

```bash
npx prisma migrate dev
```

Start the custom dev server:

```bash
npm run dev
```

Open:

- Editor: <http://localhost:3000>
- Overlay: <http://localhost:3000/overlay>

Notes:

- The custom server listens on port `3000` in `server.ts`.
- Use the `Add` button to create text or upload an image.

## Docker

The included compose file starts the app, Postgres, and Adminer.

Bring everything up:

```bash
docker compose up --build -d
```

Open:

- App: <http://localhost:3001>
- Adminer: <http://localhost:8081>

The container entrypoint runs Prisma migrations on startup.

## OBS

Add a Browser Source that points at the overlay page:

- Local: `http://localhost:3000/overlay`
- Docker: `http://localhost:3001/overlay`

## API

The UI reads and writes through the routes under `app/api`.

- `GET /api` returns all items.
- `GET /api?hidden=false` returns visible items only.
- `POST /api` creates an item.
  - Text payload: `{ type: "text", x, y, text, fontSize }`
  - Image payload: `{ type: "file", x, y, path, width, height }`
- `PATCH /api/:id` updates coordinates and either `fontSize` for text or `width`/`height` for images.
- `PATCH /api/:id/visibility` toggles the `hidden` flag.
- `DELETE /api/:id` deletes the item.

## Real-Time Events

Socket.IO broadcasts these events to other connected clients:

- `item:create`
- `item:update`
- `item:visibility`
- `item:delete`

The overlay page subscribes to the same events and only renders items where `hidden` is `false`.

## Data Model

Prisma models live in `prisma/schema.prisma`:

- `Item` stores `type`, `x`, `y`, and `hidden`.
- `TextItem` stores `text` and `fontSize`.
- `FileItem` stores `path`, `width`, and `height`.

## Notes

- Uploaded images are converted to Data URLs and saved in Postgres. That is convenient for prototyping, but large images can grow the database quickly.
- There is no authentication or authorization, so anyone who can reach the app can edit the overlay.
