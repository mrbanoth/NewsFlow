import axios from 'axios';
import type { NewsResponse, Category } from '../types/news';

const isDev = import.meta.env.DEV;

// In dev: Vite proxy rewrites /api/news/* → https://newsapi.org/v2/*
// In prod (Vercel): serverless function at /api/news handles the proxy server-side
const DEV_BASE = '/api/news';

const newsClient = axios.create();

export const newsService = {
    getTopHeadlines: async (category: Category = 'general', page: number = 1) => {
        try {
            let response;
            if (isDev) {
                // Vite proxy — direct path
                response = await newsClient.get<NewsResponse>(`${DEV_BASE}/top-headlines`, {
                    params: {
                        category,
                        page,
                        country: 'us',
                        apiKey: import.meta.env.VITE_NEWS_API_KEY,
                    },
                });
            } else {
                // Vercel serverless function — pass endpoint as query param
                response = await newsClient.get<NewsResponse>('/api/news', {
                    params: {
                        endpoint: 'top-headlines',
                        category,
                        page,
                        country: 'us',
                    },
                });
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch top headlines. Check your API key.');
            }
            throw new Error('Failed to fetch top headlines');
        }
    },

    searchNews: async (query: string, page: number = 1) => {
        try {
            let response;
            if (isDev) {
                response = await newsClient.get<NewsResponse>(`${DEV_BASE}/everything`, {
                    params: {
                        q: query,
                        page,
                        sortBy: 'publishedAt',
                        apiKey: import.meta.env.VITE_NEWS_API_KEY,
                    },
                });
            } else {
                response = await newsClient.get<NewsResponse>('/api/news', {
                    params: {
                        endpoint: 'everything',
                        q: query,
                        page,
                        sortBy: 'publishedAt',
                    },
                });
            }
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to search news. Check your API key.');
            }
            throw new Error('Failed to search news');
        }
    },
};
