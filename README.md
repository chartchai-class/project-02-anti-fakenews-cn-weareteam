# Social Anti‑Fake News System — Phase II

## Group Information
- Group Name: Social Anti‑Fake News
- Members:
  - Liao Peikun (Felix) — Student ID: 20232044
  - Lin Zhandong (Zhandong Lin) — Student ID: 20232041
  - Li Songtao (Songtao Li) — Student ID: 20232096

## Project Description
The Social Anti‑Fake News system crowdsources community wisdom to detect fake news. Users submit news items; others can vote whether a news item is fake or real and leave comments explaining their reasoning. A news item’s status is determined by votes and can be filtered on the home page.

## Features
- Home Page & News Management: list of news with filters (`All`, `Fake`, `Real`, `Unverified`) and page size selection.
- News Details & Interaction: full details (topic, summary, status, reporter, date/time) with event image; comments and vote results with pagination; vote submission with comment and optional evidence image upload.
- Admin Moderation: soft delete/restore news, update status; remove votes and auto‑recalculate scores.
- Search: search by title, summary, reporter name; combined with status filter.

## User Roles & Authentication
- Registration: first name, last name, email, password, avatar URL.
- Reader: can browse news and vote; cannot submit news.
- Member: can vote and submit news; assigned by Administrator.
- Administrator: can remove news or comments; removed news hidden from non‑admins; vote removal triggers score recalculation.
- Authentication: JWT Bearer tokens on the backend; frontend persists token in `localStorage`.

## Unique Features
- JWT‑based authentication and role authorization.
- Evidence image uploads for votes and news via storage provider.
- Admin panel for user role management and content moderation.
- Robust pagination across lists and comments.

## Technology Stack
- Frontend: React 18, Vite, React Router, Fetch API, CSS.
- Backend: Java 17, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA.
- Database: MySQL 8.0 (`spring.datasource.url` default `jdbc:mysql://localhost:3307/final_project`).
- Storage: Local or S3‑compatible (Supabase Storage endpoint) for image uploads.

## Deployment & CI/CD
- Deployment Address: `http://43.142.75.247/`
- CI/CD Pipelines: GitHub Actions for both backend and frontend.
  - Backend: builds JAR and deploys via SSH; restarts service and performs health checks (`.github/workflows/deploy-backend.yml`).
  - Frontend: workflow‑dispatch deploy to server via Docker Nginx (`.github/workflows/deploy-frontend.yml`).

## Repositories
- Root GitHub: `https://github.com/chartchai-class/project-02-anti-fakenews-cn-weareteam.git`
- Backend (path): `project-02-anti-fakenews-cn-weareteam/backend`
- Frontend (path): `project-02-anti-fakenews-cn-weareteam/project-01-anti-fakenews-cn-weareteam`

## Video
- YouTube video link: `https://youtu.be/avORa26aUDs`

## Locations (in this repository)
- Backend location: `project-02-anti-fakenews-cn-weareteam/backend`
- Frontend location: `project-02-anti-fakenews-cn-weareteam/project-01-anti-fakenews-cn-weareteam`
