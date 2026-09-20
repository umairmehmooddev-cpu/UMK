<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# UMK — Product bot + Audio Transcriber

Two tools in one app:

1. **Product bot** — builds a digital pack, stops for your review, then walks you through Etsy and Gumroad upload. It does not publish for you.
2. **Transcriber** — upload an MP3 and get a Gemini transcript.

View in AI Studio: https://ai.studio/apps/2b2d0fbd-ae46-4f64-b44c-570cb59be652

## Run locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Optional: set `GEMINI_API_KEY` in `.env.local` so the bot writes a custom pack and the transcriber can run.
3. Run: `npm run dev`

Without a Gemini key, the product bot still builds a complete template pack you can edit, download, and upload.

## Product bot flow

1. Choose pack type (podcast, meeting, student, or custom) and a niche.
2. Click **Build pack for review**.
3. Open every file, edit if needed, tick the review boxes.
4. Only then does it ask you to download the zip and upload it yourself.
