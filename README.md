# Synthetic Solutions Document Edition

Infinite canvas app with Grok agent for pressure-sensitive drawing (Apple Pencil), auto-generating charts, graphs, PDF/text documents, image/file uploads, and full exports.

## Setup
1. `npm install`
2. `npx expo start`

## GitHub Integration
- Uses device OAuth flow
- Store token via MMKV (no secrets in code)
- Create repo issues from canvas exports

## Key Generator
Three types: Promo, Paid Access, API Support. All stored locally in MMKV with full CRUD + export.

## Production Ready
Dark/light mode, TypeScript strict, Expo Router, FlashList, Reanimated gestures, Zod validation.

## Running
expo start --ios (or android)