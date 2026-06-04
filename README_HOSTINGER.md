Hostinger deployment notes
=========================

Steps to deploy MyZoneTime to Hostinger (Node.js hosting):

1. Push repository to your Git remote.
2. On Hostinger, create a Node.js app and set the application root to the repository folder.
3. Configure the start command to: `node server.js` or use `pm2 start ecosystem.config.js` if PM2 is available.
4. Ensure the `PORT` environment variable is set by Hostinger (it usually is). The app defaults to `3000`.
5. During deployment Hostinger runs `npm install` at the repo root. The `postinstall` script will install and build the frontend automatically.

Commands (local testing):

```bash
npm install
npm run build
npm start
```

If you prefer PM2:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```
