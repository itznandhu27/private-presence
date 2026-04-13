# 🫀 Private Presence — Setup Guide

A private real-time app for two people. Takes ~15 minutes to deploy.

---

## What you'll need
- A [Supabase](https://supabase.com) account (free)
- A [Netlify](https://netlify.com) account (free)
- A [GitHub](https://github.com) account (free)
- [Node.js](https://nodejs.org) installed (v18+)
- [Git](https://git-scm.com) installed

---

## Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `private-presence`, pick a region close to you
3. Save the database password somewhere safe
4. Wait ~2 minutes for it to spin up

---

## Step 2 — Set up the database

1. In your Supabase project → **SQL Editor** → **New query**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it → click **Run**
4. You should see "Success. No rows returned"

**Enable Realtime (important):**
1. Go to **Database** → **Replication** (or **Realtime** in sidebar)
2. Enable these tables:
   - `presence`
   - `messages`
   - `time_tracking`
   - `signals`

---

## Step 3 — Create the 2 users

1. In Supabase → **Authentication** → **Users** → **Add user**
2. Create user 1: enter email + password → **Create user**
3. Create user 2: enter email + password → **Create user**

> ⚠️ Use "real" emails you'll actually log in with. These are the ONLY people who can access the app.

---

## Step 4 — Get your Supabase keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon / public** key (long string starting with `eyJ...`)

---

## Step 5 — Set up the project locally

```bash
# Clone or download this project, then:
cd private-presence

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `.env` and fill in your values:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Test it locally:
```bash
npm run dev
```

Open http://localhost:5173 → log in with one of your users → it should work!

---

## Step 6 — Push to GitHub

```bash
# Create a new repo on github.com first, then:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/private-presence.git
git push -u origin main
```

---

## Step 7 — Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Connect GitHub → select your `private-presence` repo
3. Build settings (auto-detected, but verify):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Show advanced** → **New variable** and add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
5. Click **Deploy site**

Wait ~1 minute → your app is live! 🎉

---

## Step 8 — Share the link

1. Copy your Netlify URL (e.g. `https://amazing-name-123.netlify.app`)
2. Send it to your person
3. Both log in with the credentials you created in Step 3
4. You're live ❤️

---

## Features recap

| Feature | How it works |
|---|---|
| 🟢 Online status | Active / Idle (30s) / Offline |
| ⏱️ Shared timer | Only counts when BOTH are active |
| 💬 Chat | Real-time messages via Supabase |
| 🫶 Thinking of you | Button sends a glow + vibration signal |
| 📵 Tab detection | Switches to idle when tab is hidden |

---

## Updating the app

Any time you push to GitHub, Netlify auto-redeploys.

```bash
git add .
git commit -m "your change"
git push
```

---

## Troubleshooting

**Login fails:** Double-check the user exists in Supabase Auth → Users

**No realtime updates:** Make sure you enabled the tables in Supabase Realtime

**Build fails on Netlify:** Check that both env variables are set correctly in Netlify settings

**Timer not counting:** Both users must have status = "active" (not idle/offline)

---

## Want to add encryption later?

The `messages.content` field is ready for it. Add a client-side encrypt/decrypt step in `src/hooks/useChat.js` before sending and after receiving. The DB structure doesn't need to change.

---

*Built with React + Vite + Supabase + Netlify · Private · Secure · Just the two of you*
