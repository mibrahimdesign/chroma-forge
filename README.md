# Chroma Forge

Premium interactive color palette generator built with Next.js, TypeScript, and Tailwind CSS.

## Run Locally

Development mode:

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

Production preview:

```bash
npm run start
```

This command now:

1. Builds the app
2. Checks for a free local preview port starting from `3001`
3. Starts the production server on the first free port it finds

If `3001` is free, the preview will run on:

[http://127.0.0.1:3001](http://127.0.0.1:3001)

## Why `start` Uses `3001`

The project uses `3000` for development by default. Starting preview from `3001` avoids collisions with the dev server, and the automatic fallback prevents `start` from failing when another process is already using that port.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```
