# PocketBase Backend Scaffolding

This directory contains the **pre-configured PocketBase backend** for rapid hackathon prototyping.

## Quick Start (Zero Setup Time)

1. **Launch Server:**
   Double-click `start-backend.bat` or run:
   ```powershell
   .\backend\pocketbase.exe serve --http="127.0.0.1:8090"
   ```

2. **Open Admin Dashboard:**
   Visit [`http://127.0.0.1:8090/_/`](http://127.0.0.1:8090/_/) in your browser.
   - On the first run, it will prompt you to create an initial Admin email & password.
   - Use this dashboard to visually create collections, fields, and API rules in 2 minutes.

3. **REST API Base URL:**
   [`http://127.0.0.1:8090/api/`](http://127.0.0.1:8090/api/)

## Directory Structure

```
backend/
├── pocketbase.exe        # Single pre-built executable (v0.40.1, ~33MB)
├── start-backend.bat     # 1-click startup script
├── pb_hooks/             # Custom JavaScript routes & triggers (Goja engine)
│   └── main.pb.js.example
├── pb_data/              # Local SQLite database (gitignored automatically)
└── README.md
```

## Connecting from Frontend (JavaScript / TypeScript)

Install the client:
```bash
npm install pocketbase
```

Initialize client singleton:
```ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Example: CRUD
const record = await pb.collection('posts').create({ title: 'Hackathon Post' });

// Example: Live SSE Realtime
pb.collection('posts').subscribe('*', (e) => {
    console.log(e.action, e.record);
});
```

## Key Advantages for Hackathons
- **100% Offline-Capable:** Runs entirely off local SQLite (`pb_data/data.db`). Will never fail if venue Wi-Fi drops.
- **Zero Docker/Container Lag:** Boots in ~50ms.
- **Built-in Realtime:** Instant Server-Sent Events (SSE) subscriptions without complex WebSocket server setup.
