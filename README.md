<div align="center">

  # 📚 BookNook — The Digital Library Archive

  *A warm, parchment-themed personal digital library and community borrowing platform.*

  [Live Demo Site](https://booknook-archive.vercel.app) • [Backend API Repository](https://github.com/your-username/booknook-server)

</div>

---

## 📖 About BookNook

**BookNook** is an immersive, single-page full-stack web application designed for bibliophiles and digital archivists. It reimagines online libraries with a tactile, physical-book visual language—complete with 3D canvas book spine covers, dynamic library card membership tags, real-time borrow counters, and custom bookshelf skeleton loaders.

Users can browse public collections, catalog new volumes into shared shelves, track active loans, and manage personal book inventories with automated stock management.

---

## ✨ Key Features

- 🎨 **Warm Library Parchment Theme & Dark Mode**: Handcrafted design using custom palettes (`#3e342a`, `#8c6d46`, `#faf8f5`), smooth light/dark mode toggling, and lined-paper synopsis inputs.
- 📖 **Interactive 3D Book Canvas Preview**: Real-time rendering of book bindings, foil embossing, cloth textures, category badges, and page block effects as you type.
- 🔐 **Better Auth Integration & JWT Security**: Secure session authentication via MongoDB Adapter, Google OAuth social sign-in, and client-side route protection.
- 📚 **Real-Time Borrowing & Copy Tracking**: Automated stock decrementing/incrementing (`$inc`), single-active loan constraints per user, and custom checkout modal receipts.
- ⚡ **Optimized Loading States & Skeleton Loaders**: Custom animated bookshelf spine loaders (`loading.tsx`) and layout-shift-free page skeleton fallbacks.
- 📱 **Fully Responsive Layout**: Built mobile-first with adaptive drawers, sliding navigation menus, and flexible multi-column grid layouts.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router, React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & Lucide React Icons |
| **Authentication** | [Better Auth](https://www.better-auth.com/) (MongoDB Adapter) |
| **Media Host** | ImgBB API (Client-side automatic cover image upload) |
| **Animations** | Framer Motion & Custom CSS 3D Transforms |
| **Hosting** | [Vercel](https://vercel.app) |

---

## 🚀 Getting Started (Client Setup)

### Prerequisites
- Node.js `v18.x` or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/booknook-client.git
   cd booknook-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API Endpoint
   NEXT_PUBLIC_SERVER_API=http://localhost:8000

   # ImgBB API Key for Cover Image Uploads
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

   # Better Auth Configuration
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/BookNook
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (auth)/             # Login & Register modal dialog views
│   ├── add-book/           # 3D Add Book page & loading skeleton
│   ├── books/              # All Books grid & dynamic [id] detail page
│   ├── my-books/           # User inventory management (Edit/Delete)
│   ├── my-borrows/         # Active loans table & Return actions
│   ├── profile/            # User profile view
│   ├── loading.tsx         # Global bookshelf animated spine loader
│   ├── page.tsx            # Home page with hero & dynamic highlights
│   └── layout.tsx          # Root layout with theme provider & Navbar
├── components/
│   ├── Shared/             # Navbar, Footer, BorrowModal, Skeleton components
│   └── UI/                 # Buttons, Cards, Inputs, Toast notifications
└── lib/
    ├── auth-client.ts      # Better Auth client instance
    └── auth.ts             # Server-side Auth configuration
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.