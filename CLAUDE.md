# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a math puzzle application built with:
- **Frontend**: Preact (React alternative) with TypeScript and Vite
- **Backend**: Hono framework running on Cloudflare Workers
- **Storage**: Cloudflare KV for persistent data storage (not used)
- **Deployment**: Cloudflare Workers via Wrangler

## Architecture

### Frontend (src/App.tsx)
- Uses Preact hooks for state management

### Backend (src/main.tsx)
- Hono server with simple REST API:
  - `GET /api/state/:key` - retrieve list data
  - `PUT /api/state/:key` - save list data
- Serves static assets from /dist
- Uses Cloudflare KV namespace "SIDEWAYSARITHMETIC" for persistence

### Build Configuration
- Vite with Preact preset
- TypeScript with separate configs for app and node code
- Bundle visualization enabled
- React compatibility layer (preact/compat)

## Common Commands

```bash
# Development
npm run dev          # Start development server

# Build and Deploy  
npm run build        # TypeScript compile + Vite build
npm run deploy       # Deploy to Cloudflare Workers

# Code Quality
npm run lint         # ESLint checking
npm run preview      # Preview production build
```

## Development Notes

## TODOs
* School-like styling?
 - Maybe the problems look like they're on notebook paper
 - Bounding balls in the background. (Wayside School playground had ~8inch rubber balls: red, blue, yellow. They bounce different heights.)
* Music: bouncy, Commander Keen: Goodbye Galaxy-like music.