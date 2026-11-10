# Muskan & Devesh — Wedding Invitation

A responsive React + TypeScript wedding invitation frontend, styled in a modern-traditional Indian wedding aesthetic.

## Run locally
1. Install Node.js 18+.
2. In this folder, run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Customize before publishing
Open `src/App.tsx` and update:
- `WEDDING_DATE` (date and local time)
- `VENUE_NAME`, `VENUE_ADDRESS`, and `MAP_QUERY` (the current venue is a fictional demo location)
- The `gallery` image URLs
- Couple/family wording and event details

## Music
Place a licensed MP3 named `wedding-song.mp3` inside `public/`. The Play Music button will then work. Browsers require a visitor interaction before audio can start.

## RSVP note
This frontend demo stores responses in the visitor's browser `localStorage`. It does **not** send responses to you or a server yet. Connect an API/database before using it for a real wedding.

## Build
`npm run build` creates the production site in `dist/`.
