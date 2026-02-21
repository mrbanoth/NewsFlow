import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { NewsGrid } from './components/NewsGrid';
import { ArticleModal } from './components/ArticleModal';
import { useNewsStore } from './store/useNewsStore';
import { newsService } from './services/newsService';
import type { Article } from './types/news';
import { AlertCircle, Bookmark, Newspaper, RefreshCw, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const {
    articles,
    setArticles,
    isLoading,
    setLoading,
    error,
    setError,
    selectedCategory,
    searchQuery,
    favorites
  } = useNewsStore();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (showFavorites) return; // Don't fetch when viewing favorites

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (searchQuery) {
          data = await newsService.searchNews(searchQuery);
        } else {
          data = await newsService.getTopHeadlines(selectedCategory);
        }
        // Filter out articles with "[Removed]" title (common from NewsAPI)
        const cleanArticles = data.articles.filter(
          (a: Article) => a.title !== '[Removed]' && a.title
        );
        setArticles(cleanArticles);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong while fetching news.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, searchQuery, setArticles, setLoading, setError, showFavorites]);

  const handleRetry = () => {
    window.location.reload();
  };

  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      general: 'Top Stories',
      technology: 'Technology',
      business: 'Business',
      sports: 'Sports',
      science: 'Science',
      health: 'Health',
      entertainment: 'Entertainment',
    };
    return labels[selectedCategory] || 'Latest News';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      <Navbar onToggleFavorites={() => setShowFavorites(!showFavorites)} showFavorites={showFavorites} />
      {!showFavorites && <CategoryBar />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex-1">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              {searchQuery ? (
                <>
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                  Results: "{searchQuery}"
                </>
              ) : showFavorites ? (
                <>
                  <Bookmark className="w-7 h-7 text-amber-500 fill-current" />
                  Saved Articles
                </>
              ) : (
                getCategoryLabel()
              )}
            </h1>
            {!showFavorites && !searchQuery && (
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Showing the latest headlines from trusted sources
              </p>
            )}
          </div>

          {/* Article count badge */}
          {!isLoading && !error && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                {showFavorites ? favorites.length : articles.length} articles
              </span>
            </div>
          )}
        </div>

        {/* Loading State – Skeleton Cards */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50">
                  <div className="skeleton aspect-[16/10]" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-3 w-24 rounded" />
                    <div className="skeleton h-5 w-full rounded" />
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unable to Load News</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              {error}. Please check your NewsAPI key in the <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">.env</code> file and try again.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Empty Favorites State */}
        {showFavorites && favorites.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 sm:py-24">
            <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-5">
              <Bookmark className="w-10 h-10 text-amber-400 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Articles Yet</h3>
            <p className="text-slate-400 text-sm text-center max-w-sm mb-6">
              Tap the ♥ button on any article to save it here for later reading.
            </p>
            <button
              onClick={() => setShowFavorites(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all"
            >
              <Newspaper className="w-4 h-4" /> Explore Headlines
            </button>
          </div>
        )}

        {/* Content Section */}
        {!isLoading && !error && (
          showFavorites ? (
            favorites.length > 0 && (
              <NewsGrid
                articles={favorites}
                onArticleClick={setSelectedArticle}
              />
            )
          ) : (
            <NewsGrid
              articles={articles}
              onArticleClick={setSelectedArticle}
            />
          )
        )}
      </main>

      {/* Article Details Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Newspaper className="w-5 h-5 text-slate-900 dark:text-white" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">NewsFlow</span>
              <span className="text-xs text-slate-300 dark:text-slate-600">© 2024</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 dark:text-slate-500">
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms</span>
              <a href="mailto:support@verlynk.com" className="hover:text-blue-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
