# SiteFlow backend

Express + MongoDB API (routes / controllers / services / repositories / models).

Companion UI: [crmanderpfront](https://github.com/Pushkar9829/crmanderpfront)

## Setup

```bash
copy .env.example .env
npm install
npm run seed
npm run dev
```

Required env: `MONGODB_URI`, `JWT_SECRET`. See `.env.example`.

Demo login after seed: `admin@local` / `admin123`

## Deploy

Set `HOST=0.0.0.0`, `NODE_ENV=production`, `CLIENT_ORIGIN` to the frontend URL, and `SERVE_CLIENT=false` when the UI is hosted separately. Then `npm start`.
