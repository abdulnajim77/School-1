# SchoolSync - Student Safety, School Transport Tracking & Management Platform

A complete, modern, production-ready SaaS application for kindergarten, primary schools, and private educational institutions.

SchoolSync combines **live GPS school bus tracking, trigonometric Haversine geofencing, boarding and drop confirmation, automated leave and transport skip sync, parent notifications, fees, attendance, homework, exams, and multi-school tenancy** into a unified, high-performance platform.

---

## 1. Project Overview

SchoolSync is engineered specifically to eliminate chaotic communication between parents, school bus drivers, helpers, and school administrators.

### Key Highlights:
- **Two Operating Modes**:
  - **Demo Mode (`VITE_APP_MODE=demo`)**: Operates 100% offline with zero cloud dependencies, simulated live GPS movement, geofence radius triggers, and preloaded sample accounts.
  - **Production Mode (`VITE_APP_MODE=production`)**: Connects seamlessly to Firebase Authentication, Cloud Firestore, Firebase Realtime Database (for low-latency GPS telemetry), and Google Maps.
- **Portability Guarantee**: 100% editable and portable codebase. Runs locally on Windows, macOS, or Linux, and deploys effortlessly to Firebase Hosting, Vercel, Netlify, Cloudflare Pages, or any VPS.
- **Multi-School SaaS Architecture**: Tenant isolation where every record resides under `schools/{schoolId}`.
- **Child Privacy & Safety**: Coordinates and transport data are restricted so parents only see their assigned children.

---

## 2. System Requirements

- **Node.js**: Version 18.x, 20.x, or 22.x LTS (Download from [nodejs.org](https://nodejs.org))
- **Package Manager**: `npm` (version 9.x or higher)
- **Web Browser**: Modern Chrome, Edge, Safari, or Firefox (Mobile & Desktop supported)

---

## 3. Install Node.js on Your Computer

### Windows:
1. Visit [https://nodejs.org](https://nodejs.org) and download the **LTS** Windows Installer (`.msi`).
2. Run the installer and click **Next** through the setup wizard (ensure the "Add to PATH" option is checked).
3. Open PowerShell or Command Prompt and verify:
   ```bash
   node -v
   npm -v
   ```

### macOS / Linux:
```bash
# macOS via Homebrew
brew install node

# Ubuntu/Debian Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 4. Download and Extract the Project

1. Download the complete ZIP archive from the builder.
2. Extract the archive into a folder on your computer (e.g. `C:\Projects\SchoolSync` on Windows or `~/projects/schoolsync` on Mac/Linux).

---

## 5. Install Dependencies

Open your terminal or Command Prompt in the project folder and run:

```bash
npm install
```

All required packages (`react`, `react-router-dom`, `lucide-react`, `tailwindcss`, `firebase`, `canvas-confetti`) will be installed.

---

## 6. Start Local Development

To launch the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 7. Production Build

To compile and bundle the application for production:

```bash
npm run build
```

This generates an optimized, minified production build in the `dist/` directory.

---

## 8. The `dist/` Folder Explained

The `dist/` folder contains:
- `index.html`: The HTML5 entry point.
- `assets/`: Minified JavaScript bundles and compiled CSS stylesheets.
- `manifest.json`: Progressive Web App (PWA) manifest for installability.

This directory is ready to be served by any static web server (Nginx, Apache, Caddy, Vercel, Netlify, Cloudflare Pages, or Firebase Hosting).

---

## 9. Demo Mode Setup (Default)

In Demo Mode, **no Firebase or Google Maps keys are required**. You can download and immediately demonstrate the platform to school principals and owners.

### Configuration (`.env`):
```env
VITE_APP_MODE=demo
```

### Preconfigured Demo Accounts:
| Role | Email | Password | Features Tested |
| :--- | :--- | :--- | :--- |
| **Parent** | `parent@demo.com` | `demo123` | Live bus tracking, ETA, fees, attendance, leave request, bus skip |
| **Driver** | `driver@demo.com` | `demo123` | Start morning trip, stop-by-stop boarding, leave audit, emergency alert |
| **Admin** | `admin@demo.com` | `demo123` | Fleet radar, student CRUD, geofence radius editor, leave approvals |
| **Teacher** | `teacher@demo.com` | `demo123` | Bulk morning attendance, homework assignments, student roster |

---

## 10. Production Mode Setup

To run against live Firebase cloud infrastructure:

1. Update `.env`:
   ```env
   VITE_APP_MODE=production
   ```
2. Populate the Firebase environment variables (see Section 11).

---

## 11. Environment Variables Reference

Create a file named `.env` in the root folder based on `.env.example`:

```env
# Operating Mode: 'demo' or 'production'
VITE_APP_MODE=demo

# Firebase Cloud Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef
VITE_FIREBASE_DATABASE_URL=https://your-app-default-rtdb.firebaseio.com

# Google Maps Platform (Optional in demo mode)
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

---

## 12. Firebase Authentication Setup

1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Create a new project or select an existing one.
3. In the left sidebar, click **Build > Authentication**.
4. Click **Get Started** and enable **Email/Password** under Sign-in providers.
5. In your custom claims or user documents, store `schoolId` and `role`.

---

## 13. Cloud Firestore Setup

1. In the Firebase Console, go to **Build > Firestore Database**.
2. Click **Create database** and select your cloud region.
3. Deploy the provided `firestore.rules` file:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

---

## 14. Firebase Realtime Database Setup (For High-Frequency GPS)

1. In the Firebase Console, click **Build > Realtime Database**.
2. Click **Create Database**.
3. High-frequency driver GPS coordinates are written to `liveTrips/{tripId}`:
   ```json
   {
     "schoolId": "school_001",
     "busId": "bus_003",
     "currentLatitude": 22.8580,
     "currentLongitude": 88.3540,
     "speed": 32,
     "heading": 45,
     "lastUpdated": "8:04:32 AM"
   }
   ```

---

## 15. Firebase Storage Setup

1. In the Firebase Console, go to **Build > Storage**.
2. Enable Cloud Storage for student profile photos, leave medical certificates, and school notice circular PDFs.

---

## 16. Firebase Cloud Messaging (FCM) Setup

1. In the Firebase Console, click **Project Settings > Cloud Messaging**.
2. Generate a Web Push Certificate (VAPID key) to deliver instant background push alerts when a bus enters a student's 100m geofence.

---

## 17. Google Maps Platform Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Enable the **Maps JavaScript API** and **Directions API**.
3. Create an API Key and restrict it to your production domain(s).
4. Paste the key in `.env` as `VITE_GOOGLE_MAPS_API_KEY`.

---

## 18. Firebase Hosting Deployment

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Hosting
firebase init hosting
# - Public directory: dist
# - Configure as a single-page app (rewrite all urls to /index.html): Yes
# - Overwrite dist/index.html: No

# 4. Build and Deploy
npm run build
firebase deploy --only hosting
```

---

## 19. Vercel Deployment

1. Install the Vercel CLI or connect your Git repository in the Vercel Dashboard:
   ```bash
   npm install -g vercel
   vercel
   ```
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add environment variables (`VITE_APP_MODE=demo` or your production credentials) in the Vercel Project Settings.

---

## 20. Netlify Deployment

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```
2. Or connect via Git on [netlify.com](https://www.netlify.com). Ensure redirects for Single Page Applications (SPA) are configured in a `_redirects` file:
   ```
   /*    /index.html   200
   ```

---

## 21. Custom Domain Setup

1. In your hosting provider (Firebase, Vercel, Netlify, or Cloudflare), click **Add Custom Domain**.
2. Enter your domain (e.g. `schoolsync.yourdomain.com`).
3. Add the provided `CNAME` or `A` records to your DNS provider (e.g. GoDaddy, Namecheap, Cloudflare).
4. SSL certificates are provisioned automatically.

---

## 22. Troubleshooting & FAQ

- **Port 3000 in use**: Run `npx kill-port 3000` or specify another port via `npm run dev -- --port 3001`.
- **Firebase permission errors**: Ensure you deployed `firestore.rules` and that users have matching `schoolId` claims.
- **Blank map in demo mode**: Demo Mode uses an integrated SVG/Canvas interactive map that requires no API keys. Make sure JavaScript is enabled in your browser.
- **Resetting mock data**: In Admin Settings, click **Reset Demo Data** to restore all records to their initial state.
