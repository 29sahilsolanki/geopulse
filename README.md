# 📍 GeoPulse EMS

GeoPulse is a full-stack workforce management and automated attendance tracking system powered by next-generation location intelligence. It utilizes strict geofencing parameters to ensure remote or on-site workers can only clock in/out if their device coordinates fall within the assigned manager perimeter.

---

## 🛠️ Technology Stack & Architecture

- **Framework:** Next.js 16 (App Router)
- **Database ORM:** Prisma Client with relational connection pooling
- **Authentication:** Auth0 Identity Engine (`@auth0/nextjs-auth0`)
- **Mapping & Geofencing:** React Leaflet & OpenStreetMap (Nominatim Reverse Geocoding API)
- **Mathematical Engine:** Haversine Formula for absolute spatial radius verification
- **Styling UI:** Tailwind CSS v4 + React Icons
- **Data Visualization:** Chart.js with React Chartjs 2 (Doughnut distribution mix)
- **State Management:** React Context API & TanStack React Query

---

## 🚀 Key System Features

- **Secure Handshake Authentication:** Protected route layers dividing access control streams securely between `MANAGER` and `WORKER` nodes.
- **Interactive Geofence Panel:** Live manager configurations capable of dropping anchor coordinates and adjusting permitted metric radiuses directly on a Leaflet map.
- **Asli-Time Roster Streams:** Live worker logs dashboard sorting shift states dynamically using an implicit `clockIn: "desc"` database order.
- **One-Tap Browser Locator:** Native browser GPS synchronization with automated address lookup fallback layers.
- **Progressive Web App (PWA):** Built-in custom standalone manifest configuration for instant desktop and mobile installations.

---

## 📊 Quick Execution Script Matrix

| Execution Intent      | Command Script        | Target Mode / Runtime Status          |
| :-------------------- | :-------------------- | :------------------------------------ |
| **Install Packages**  | `npm install`         | Setup Initialization & Chunks Pull    |
| **Prisma Generation** | `npx prisma generate` | DB Schema Client Compilation          |
| **Local Development** | `npm run dev`         | Dev Run (With Engine Hot Reloading)   |
| **Production Build**  | `npm run build`       | Optimized Code Standalone Compilation |
| **Production Start**  | `npm run start`       | Local Production Server Live Boot up  |

---

## 📦 Getting Started & Local Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/geopulse.git](https://github.com/your-username/geopulse.git)
cd geopulse
```
