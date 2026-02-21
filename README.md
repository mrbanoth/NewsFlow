# NewsFlow - Real-time News Aggregator

A high-performance, responsive news aggregator built with React, TypeScript, and Zustand. Fetches real-time headlines from NewsAPI.

## Features
- **Real-time Headlines**: Fetch latest news across categories (Technology, Business, Sports, etc.).
- **Global Search**: Search for articles by keywords.
- **Persistent Favorites**: Save articles to your local library (persisted via LocalStorage).
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens.
- **Article Details**: Detailed view for every article with full description and source link.
- **Dark Mode Support**: Automatically shifts based on system preferences.

## Tech Stack
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persistence)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository or extract the files.
2. Navigate to the project directory:
   ```bash
   cd Task
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Configuration
1. Create a `.env` file in the root directory (you can copy `.env.example`).
2. Add your [NewsAPI](https://newsapi.org/) key:
   ```env
   VITE_NEWS_API_KEY=your_actual_api_key_here
   ```

### Running the Application
- **Development**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Run Tests**:
  ```bash
  npx vitest run
  ```

## Submission Guidelines Links
- **Email**: support@verlynk.com
- **Project Structure**: Clean architecture with services, store, and responsive components.
- **Error Handling**: Comprehensive error boundaries and user-friendly messages for API failures.

---
Developed as part of the technical assessment for Verlynk.
