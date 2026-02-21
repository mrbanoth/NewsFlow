# NewsFlow — Real-time News Aggregator

A high-performance, responsive news aggregator built with **React 19**, **TypeScript**, **Zustand**, and **Tailwind CSS v4**. Fetches real-time headlines from [NewsAPI](https://newsapi.org/).

> Built as a technical assessment for **Verlynk — Software Developer (Frontend)** position.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Category Browsing** | Browse headlines across 7 categories — General, Technology, Business, Sports, Science, Health, Entertainment |
| **Keyword Search** | Live debounced search (500ms) that filters articles as you type |
| **Article Details** | Click any card to open a detailed modal with title, image, description, and link to the full article |
| **Favorites** | Save articles to a favorites list persisted in `localStorage`. View, access, and remove saved articles anytime |
| **Error Handling** | Graceful error UI with retry button for API failures and invalid responses |
| **Responsive Design** | Mobile-first design optimized for phones, tablets, and desktops |
| **Dark Mode** | Automatic dark mode based on system preferences |
| **Skeleton Loaders** | Animated loading skeletons while fetching data |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| State Management | [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Testing | [Vitest](https://vitest.dev/) |
| Deployment | [Vercel](https://vercel.com/) (with serverless API proxy) |

---

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── Navbar.tsx        — Top navigation with search (desktop + mobile overlay)
│   ├── CategoryBar.tsx   — Horizontal scrollable category pills
│   ├── NewsGrid.tsx      — Responsive article grid layout
│   ├── NewsCard.tsx      — Individual article card with favorite toggle
│   └── ArticleModal.tsx  — Full article detail modal with share/favorite
├── services/
│   └── newsService.ts    — NewsAPI client with Vite proxy (dev) / Vercel proxy (prod)
├── store/
│   ├── useNewsStore.ts   — Zustand store (articles, favorites, categories, search)
│   └── useNewsStore.test.ts — 20 unit tests
├── types/
│   └── news.ts           — TypeScript interfaces (Article, NewsResponse, Category)
├── utils/
│   └── cn.ts             — Tailwind class merge utility (clsx + tailwind-merge)
├── App.tsx               — Root component with layout, data fetching, error/loading states
├── main.tsx              — React entry point
└── index.css             — Global styles, animations, scrollbar, skeleton keyframes
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A free **NewsAPI** key from [https://newsapi.org/register](https://newsapi.org/register)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mrbanoth/NewsFlow.git
cd NewsFlow

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Add your NewsAPI key to .env
# VITE_NEWS_API_KEY=your_actual_api_key_here
```

### Running the App

```bash
# Development server (http://localhost:5174)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npx vitest run

# Lint
npm run lint
```

---

## 🧪 Testing

**20 unit tests** covering the Zustand store:

| Test Group | Tests | Coverage |
|------------|-------|----------|
| Articles | 3 | Initialize, set, replace |
| Favorites | 5 | Add, add multiple, remove, remove non-existent, keep others |
| Loading State | 2 | Set true, set false |
| Error State | 2 | Set error, clear error |
| Category | 3 | Default value, update, clears search on change |
| Search Query | 2 | Update, handle empty |
| Integration | 1 | Favorites independent from articles |

```bash
npx vitest run
# ✓ 20 tests passed
```

---

## 🌐 Deployment (Vercel)

The app is deployed on Vercel with a **serverless API proxy** (`api/news.ts`) to bypass NewsAPI's CORS restrictions on production.

**Environment variables needed on Vercel:**
- `VITE_NEWS_API_KEY` — Your NewsAPI key
- `VITE_NEWS_API_BASE_URL` — `https://newsapi.org/v2`

---

## 📋 Requirements Checklist

- [x] React project with essential components
- [x] NewsAPI integration for real-time headlines
- [x] Category-based browsing (Technology, Business, Sports, etc.)
- [x] Search bar with keyword search
- [x] Article detail view (title, image, description, source link)
- [x] Favorites with localStorage persistence
- [x] View, access, and remove favorites
- [x] Error handling with user-friendly messages
- [x] Responsive design for all screen sizes
- [x] TypeScript throughout
- [x] Zustand for global state management
- [x] Clean, readable, organized code
- [x] Comprehensive test coverage (20 tests)
- [x] Clear documentation

---

Developed by **Banoth** • [GitHub](https://github.com/mrbanoth)
