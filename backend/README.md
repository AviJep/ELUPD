# Backend

This directory contains a simple Express server written in TypeScript.

## Available scripts

- `npm run dev` - start the server with ts-node and nodemon for development
- `npm run build` - compile TypeScript into the `dist` directory
- `npm run start` - run the compiled server

The server listens on `PORT` environment variable or `3001` by default and
exposes a health endpoint at `/api/health`.
