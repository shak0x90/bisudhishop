# BisudhiShop 🌿

Welcome to the **BisudhiShop** repository! This is a modern e-commerce platform built with **Medusa JS** (headless commerce backend) and **Next.js** (React storefront framework), tailored specifically for the Bangladeshi grocery market.

---

## 🚀 Features & Recent Updates

We've made several core improvements to customize the base platform into a fully functional grocery e-commerce solution:

### 1. Storefront Improvements (Next.js)
- **Category Routing Fixed**: Resolved 404 navigation errors by mapping subcategories properly under the `/categories/` routing system, removing hardcoded `/store/` links.
- **Edge Runtime Networking Fix**: Fixed `TypeError: fetch failed` during frontend middleware executions (`getRegionMap`) by properly routing internal requests to IPv4 (`127.0.0.1:9000`) instead of hitting IPv6 constraints.
- **UI Enhancements**: Ensured all category-related images and dynamic paths render securely and responsively.

### 2. Backend & Data Seeding (Medusa JS)
- **Market Customization**: Fully configured the default region for **Bangladesh** with **BDT (Bangladeshi Taka)** as the default currency.
- **Grocery Data Scaffolded**: Automated the generation of a robust catalog layout with 7 primary grocery categories and 15 highly-detailed dummy products (complete with prices and contextual media).
- **Localized Shipping Operations**: Built custom Dhaka-specific fulfillment and shipping models suitable for local delivery logistics.

### 3. Admin Dashboard Enhancements
- **Enhanced Image Upload UX**: Overhauled the Admin Media Upload component. Brought the image preview visibility to the top of the component (with a larger `h-64` view and emerald success borders) and exposed the absolute file path, preventing users from missing successful uploads.

---

## 🛠️ Tech Stack

- **Backend System**: [Medusa JS](https://medusajs.com/) (Node.js framework for composable commerce)
- **Frontend / Storefront**: [Next.js](https://nextjs.org/) (React App Router)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Styling**: Tailwind CSS

---

## 💻 Running Locally

### Prerequisites
Make sure you have Node.js (v18+), PostgreSQL, and Redis installed and running.

### 1. Backend Setup (Medusa)
```bash
# Navigate to the root directory
cd organichub

# Install dependencies (if not done)
npm install # or yarn install

# Setup environment variables
cp .env.template .env
# Edit .env with your PostgreSQL/Redis connection strings

# Optional: Restore the database from the provided backup
# This will save you time from running migrations and seeding products
createdb -U postgres medusa-organichub
psql -U postgres -d medusa-organichub < medusa-organichub-backup.sql

# If you did not restore from the backup, run migrations yourself:
# npx medusa migrations run

# Start the server
npm run dev
```

### 2. Storefront Setup (Next.js)
```bash
# In a new terminal, navigate to the storefront
cd organichub/storefront

# Setup environment variables
cp .env.template .env.local

# Start the frontend application
npm run dev
```

**Note:** Ensure that your `.env.local` uses `http://127.0.0.1:9000` for the `MEDUSA_BACKEND_URL` to prevent edge-runtime fetch errors on modern Node setups.

---

## 🤝 Contributing
For further development, simply checkout to a new branch and submit pull requests.
Please make sure to check environment consistency when making API-level changes between the Admin, Storefront, and Backend modules.
