# 🔐 How to Set Up Supabase for Riannie's Kitchen

This is a plain-English, step-by-step guide. Follow every step in order.

---

## STEP 1 — Create a Free Supabase Account

1. Open your browser and go to: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or your email
4. Once logged in, you'll see your dashboard

---

## STEP 2 — Create a New Project

1. Click the green **"New project"** button
2. Fill in the details:
   - **Name:** `riannies-kitchen` (or anything you like)
   - **Database Password:** choose a strong password — **write it down somewhere safe!**
   - **Region:** choose **West EU (Ireland)** — it's closest to Nigeria
3. Click **"Create new project"**
4. Wait about 2 minutes while it sets up

---

## STEP 3 — Set Up the Database Tables

This creates all your menu, orders, and settings tables automatically.

1. In your Supabase project, look at the left sidebar
2. Click **"SQL Editor"** (it looks like a `>_` icon)
3. Click **"New query"** at the top
4. Open the file **`supabase_schema.sql`** from the project folder on your computer
5. Select ALL the text in that file (Ctrl+A / Cmd+A) and Copy it
6. Paste it into the Supabase SQL Editor box
7. Click the green **"Run"** button
8. You should see: *"Success. No rows returned"* ✅

---

## STEP 4 — Create the Image Storage Bucket

This lets the admin upload food photos.

1. In the left sidebar, click **"Storage"**
2. Click **"New bucket"**
3. In the Name field, type exactly: `menu-images`
4. Find the toggle that says **"Public bucket"** and turn it **ON**
5. Click **"Save"**

---

## STEP 5 — Create Your Admin Login

This creates the email + password you'll use to log into `/admin/login`.

1. In the left sidebar, click **"Authentication"**
2. Click **"Users"** at the top
3. Click **"Add user"** → **"Create new user"**
4. Enter:
   - **Email:** your email address (e.g. `rianniekitchen@gmail.com`)
   - **Password:** a strong password (at least 8 characters)
5. Click **"Create user"**

> ⚠️ **Remember this email and password** — you'll need them to log into the admin panel!

---

## STEP 6 — Get Your API Keys

1. In the left sidebar, click **"Settings"** (gear icon at the bottom)
2. Click **"API"**
3. You'll see two important values:
   - **Project URL** — looks like: `https://abcdefghijk.supabase.co`
   - **anon public** key — a very long string starting with `eyJhbGci...`

---

## STEP 7 — Add Keys to Your Project

1. Open the **`riannies-kitchen`** project folder on your computer
2. Find the file called **`.env.example`**
3. Make a **copy** of it and rename the copy to **`.env`**
4. Open `.env` in any text editor (Notepad, VS Code, etc.)
5. Replace the placeholder values with your real keys:

```
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

6. Save the file

> ⚠️ **Never share your `.env` file with anyone!**

---

## STEP 8 — Run the App

Open a terminal (Command Prompt on Windows, Terminal on Mac) in the project folder and run:

```bash
npm install
npm run dev
```

Then open your browser and go to: **http://localhost:5173**

You should see the full Riannie's Kitchen store! 🍜

---

## STEP 9 — Log In to Admin Panel

1. Go to: **http://localhost:5173/admin/login**
2. Enter the email and password you created in Step 5
3. Click **"Sign In to Dashboard"**
4. You're in! 🎉

From the admin panel you can:
- ➕ Add new food items with photos
- ✏️ Edit prices and descriptions
- 🔄 Toggle items available/unavailable
- 📋 View and manage customer orders
- ⚙️ Update your WhatsApp number, email, hours

---

## 🚀 Publish Your Site Online (Optional)

To make the site live so customers can access it:

### Option A — Netlify (Free, Easiest)
1. Go to **https://netlify.com** and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub (push the project to GitHub first)
4. In **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL` = your URL
   - `VITE_SUPABASE_ANON_KEY` = your key
5. Click **Deploy**

### Option B — Build and drag-and-drop
1. Run: `npm run build`
2. This creates a `dist/` folder
3. Go to Netlify → drag the `dist` folder onto the page
4. Add environment variables as above

---

## ❓ Common Problems

| Problem | Fix |
|---|---|
| "Invalid login credentials" | Double-check email/password in Supabase Auth → Users |
| Menu not loading | Make sure you ran the SQL schema (Step 3) |
| Image upload not working | Make sure the `menu-images` bucket is set to **Public** (Step 4) |
| Page shows "your-project" | You haven't set up your `.env` file yet (Step 7) |
| Site works locally but not online | Add environment variables to Netlify/Vercel settings |

---

*Questions? WhatsApp: 08084378019*
