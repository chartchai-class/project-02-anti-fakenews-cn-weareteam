# Social Anti-Fake News System

A React single-page application that crowdsources votes and comments to assess whether news items are fake or not. Users can browse news, filter by status, view full details with comments and votes, and submit their own vote with a comment and optional image URL. Data is kept in-memory (no server calls) and mock data is provided for pagination.

## Features
- Home list with filter: `All`, `Fake`, `Not Fake`, `Unverified`
- Page size selection and pagination for the news list
- News detail page: topic, full detail, status, reporter, date/time, and image link
- Comments section with pagination and votes summary
- Vote page to submit `Fake` or `Not Fake`, with comment and optional evidence image URL
- In-memory storage; user-submitted data is visible immediately but resets on reload

## Run Locally
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Open: Vite will print a local URL to preview

## Deployment (Vercel)
- Build: `npm run build`
- Deploy the `dist` folder on Vercel

## Submission
- Deployed URL: https://project-01-anti-fakenews-cn-wearete.vercel.app/
- Demo video (2–3 min): https://youtu.be/sQyt1mo6bvE

## Group Information
- Group Name: Social Anti-Fake News
- Members:
  - Liao Peikun(felix) — 20232044
  - Li Songtao — 20232096
  - Lin Zhandong — 20232043

Updated: 17th Oct 2025
