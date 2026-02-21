import axios from 'axios';
import type { NewsResponse, Category } from '../types/news';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// In development, use the Vite proxy to bypass CORS.
// In production, you'd need a backend server or serverless function.
const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? '/api/news' : (import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2');

const newsClient = axios.create({
    baseURL: BASE_URL,
    params: {
        apiKey: API_KEY,
    },
});

export const newsService = {
    getTopHeadlines: async (category: Category = 'general', page: number = 1) => {
        try {
            const response = await newsClient.get<NewsResponse>('/top-headlines', {
                params: {
                    category,
                    page,
                    country: 'us',
                },
            });
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
            const response = await newsClient.get<NewsResponse>('/everything', {
                params: {
                    q: query,
                    page,
                    sortBy: 'publishedAt',
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to search news. Check your API key.');
            }
            throw new Error('Failed to search news');
        }
    },
};
