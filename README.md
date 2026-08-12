# JLG Map App

A map-centric web application for the ** Joe Louis Greenway** -- a 30-mile recreational pathway in Detroit connecting neighborhoods, parks, and destinations via trails and bike lanes. The app helps walkers, bikers, runners, residents, and visitors explore the greenway route, find nearby amenities, and navigate the trail. 


## What the app will do 

### Core planned capabilities, drawn from the stakeholders' essential-features list: 
- Display accurate greenway routes and key landmarks
- Show trailheads/access points, parking, restrooms, play areas, food venues, and event spaces
- Mode-aware navigation (walking, biking) along the trail
- Surface dynamic information such as conditions, closures, and events

### Design Principles 
- Privacy-First: live location stays on the device; the server never stores user coordinates, and public use requires no login.

Tech Stacks 
- **Language:** TypeScript
- **Frontend:** React + Vite, MapLibre GL JS,Turf.js
- **Map data:** OpenStreetMap base, custom greenway data served as PMTiles
- **Hosting:** Cloudflare Pages, Cloudflare R2
- **Backend:** Node.js + Express (self-hosted), behind Nginx + Cloudflare
- **Database:** PostgreSQL + PostGIS; pgRouting; pg_trgm
- **Admin auth:** Firebase Auth for staff authoring events and trail status


## Getting started

**Prerequisites**

- Node.js [22 LTS — confirm]
- pnpm [9 — confirm]
- PostgreSQL with the PostGIS extension

**Clone**
git clone https://github.com/asmitabhandari/jlgmapapp.git
cd jlgmapapp


## Team
- Maha — Project Lead Software Engineer
- Asmita - Cybersecurity Intern
- Rachael - Cybersecurity Intern
- Lawrence - Frontend Developer
-  Musammat - Software Tester
- Asim  — reviewer/approvals





