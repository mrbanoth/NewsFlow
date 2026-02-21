import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Article, Category } from '../types/news';

interface NewsState {
    articles: Article[];
    favorites: Article[];
    isLoading: boolean;
    error: string | null;
    selectedCategory: Category;
    searchQuery: string;
    setArticles: (articles: Article[]) => void;
    addFavorite: (article: Article) => void;
    removeFavorite: (url: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setSelectedCategory: (category: Category) => void;
    setSearchQuery: (query: string) => void;
}

export const useNewsStore = create<NewsState>()(
    persist(
        (set) => ({
            articles: [],
            favorites: [],
            isLoading: false,
            error: null,
            selectedCategory: 'general',
            searchQuery: '',
            setArticles: (articles) => set({ articles }),
            addFavorite: (article) =>
                set((state) => ({
                    favorites: [...state.favorites, article],
                })),
            removeFavorite: (url) =>
                set((state) => ({
                    favorites: state.favorites.filter((a) => a.url !== url),
                })),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            setSelectedCategory: (category) => set({ selectedCategory: category, searchQuery: '' }),
            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'news-storage',
            partialize: (state) => ({ favorites: state.favorites }),
        }
    )
);
