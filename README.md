# 🍜 Riannie's Kitchen — React + Supabase Web App

A full-stack food ordering website for Riannie's Kitchen at LASU Ojo Campus, Lagos.

---

## ✅ Features

- Beautiful animated storefront with menu browsing
- Cart with quantity controls
- WhatsApp & Email order submission
- Full Admin Dashboard (login required):
  - Add / Edit / Delete menu items with image upload
  - Manage categories
  - View & update order status
  - Store settings (WhatsApp, email, hours, open/closed)
  - Change admin password
- Supabase backend (PostgreSQL + Storage + Auth)

---

## 🚀 Setup in 6 Steps

### Step 1 — Create a Supabase Project
1. Go to https://supabase.com and sign up (free)
2. Click **New Project**
3. Enter a project name (e.g. "riannies-kitchen")
4. Set a strong database password (save it somewhere!)
5. Choose region: **West EU (Ireland)** or **US East** for best Nigeria latency
6. Click **Create new project** and wait ~2 minutes

---

### Step 2 — Run the Database Schema
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase_schema.sql` from this project folder
4. Copy ALL the contents and paste into the SQL Editor
5. Click **Run** (green button)
6. You should see "Success. No rows returned" — that means it worked!

This creates:
- `menu_items` table (with starter menu data)
- `categories` table
- `store_config` table
- `orders` table
- Row Level Security (RLS) policies

---

### Step 3 — Create a Storage Bucket for Images
1. In Supabase dashboard → click **Storage** in the left sidebar
2. Click **New bucket**
3. Name it exactly: `menu-images`
4. Toggle **Public bucket** to ON
5. Click **Save**

This allows the admin to upload food photos.

---

### Step 4 — Create Your Admin Login
1. In Supabase dashboard → click **Authentication** → **Users**
2. Click **Invite user** (or **Add user** → **Create new user**)
3. Enter your email address and a strong password
4. Click **Create user**

This email + password is what you'll use to log into `/admin`.

---

### Step 5 — Get Your API Keys
1. In Supabase dashboard → click **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

3. In the project root folder, create a file called `.env`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Never share your `.env` file or commit it to Git!**

---

### Step 6 — Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 — you'll see the store!
Open http://localhost:5173/admin — log in with the email/password from Step 4.

---

## 🏗 Build for Production
```bash
npm run build
```
The `dist/` folder is ready to deploy to Netlify, Vercel, or any static host.

### Deploy to Netlify (free):
1. Go to https://netlify.com → New site → Import from Git (or drag the `dist` folder)
2. Set environment variables in Site Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Add a `_redirects` file in the `public/` folder:
   ```
   /* /index.html 200
   ```
   This makes React Router work on page refresh.

---

## 📁 Project Structure

```
riannies-kitchen/
├── public/
├── src/
│   ├── components/
│   │   ├── cart/          CartSidebar (order form + WA/Email)
│   │   ├── layout/        Navbar, Footer
│   │   ├── menu/          MenuCard
│   │   └── ui/            BackgroundCanvas, Loader
│   ├── context/
│   │   ├── AuthContext    Supabase auth state
│   │   └── CartContext    Shopping cart state
│   ├── hooks/
│   │   └── useData.js     Data fetching hooks (menu, categories, orders, config)
│   ├── lib/
│   │   └── supabase.js    Supabase client
│   ├── pages/
│   │   ├── Home.jsx       Public storefront
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminLayout.jsx    (sidebar + protected route)
│   │       ├── AdminDashboard.jsx (stats overview)
│   │       ├── AdminMenu.jsx      (add/edit/delete menu items + image upload)
│   │       ├── AdminCategories.jsx
│   │       ├── AdminOrders.jsx    (view + update order status)
│   │       └── AdminSettings.jsx  (store config + password change)
│   ├── App.jsx            Router
│   └── main.jsx
├── supabase_schema.sql    ← Run this in Supabase SQL Editor
├── .env.example           ← Copy to .env and fill in your keys
└── README.md
```

---

## 🔒 Security Notes

- All admin routes are protected by Supabase Auth — unauthenticated users are redirected to `/admin` login
- Row Level Security (RLS) is enabled on all tables:
  - Public can only **read** menu items, categories, store config
  - Public can **insert** orders (needed for checkout)
  - Only **authenticated** admins can write/update/delete anything
- Never expose your Supabase **service_role** key — only use the **anon** key in the frontend
- The `.env` file is gitignored by default

---

## 📞 Support

WhatsApp: 08084378019  
Location: LASU Ojo Campus, Lagos  
Hours: Mon–Sat, 12PM–7PM
