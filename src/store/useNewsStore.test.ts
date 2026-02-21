import { describe, it, expect, beforeEach } from 'vitest';
import { useNewsStore } from '../store/useNewsStore';
import type { Article } from '../types/news';

// Helper to create a mock article
const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
    source: { id: 'test-source', name: 'Test Source' },
    author: 'Test Author',
    title: 'Test Headline',
    description: 'A test description of the article.',
    url: `https://example.com/${Date.now()}-${Math.random()}`,
    urlToImage: 'https://example.com/image.jpg',
    publishedAt: new Date().toISOString(),
    content: 'Full content of the test article.',
    ...overrides,
});

describe('useNewsStore', () => {
    beforeEach(() => {
        // Reset store to defaults before each test
        useNewsStore.setState({
            articles: [],
            favorites: [],
            isLoading: false,
            error: null,
            selectedCategory: 'general',
            searchQuery: '',
        });
    });

    // ─── Articles ──────────────────────────────────────

    it('should initialize with empty articles', () => {
        const { articles } = useNewsStore.getState();
        expect(articles).toEqual([]);
    });

    it('should set articles', () => {
        const mockArticles = [createMockArticle(), createMockArticle()];
        useNewsStore.getState().setArticles(mockArticles);
        expect(useNewsStore.getState().articles).toHaveLength(2);
    });

    it('should replace articles on repeated setArticles calls', () => {
        useNewsStore.getState().setArticles([createMockArticle()]);
        expect(useNewsStore.getState().articles).toHaveLength(1);

        const newArticles = [createMockArticle(), createMockArticle(), createMockArticle()];
        useNewsStore.getState().setArticles(newArticles);
        expect(useNewsStore.getState().articles).toHaveLength(3);
    });

    // ─── Favorites ─────────────────────────────────────

    it('should add an article to favorites', () => {
        const article = createMockArticle({ url: 'https://example.com/fav1' });
        useNewsStore.getState().addFavorite(article);
        const { favorites } = useNewsStore.getState();
        expect(favorites).toHaveLength(1);
        expect(favorites[0].url).toBe('https://example.com/fav1');
    });

    it('should add multiple articles to favorites', () => {
        const a1 = createMockArticle({ url: 'https://example.com/a' });
        const a2 = createMockArticle({ url: 'https://example.com/b' });
        useNewsStore.getState().addFavorite(a1);
        useNewsStore.getState().addFavorite(a2);
        expect(useNewsStore.getState().favorites).toHaveLength(2);
    });

    it('should remove an article from favorites by URL', () => {
        const article = createMockArticle({ url: 'https://example.com/remove-me' });
        useNewsStore.getState().addFavorite(article);
        expect(useNewsStore.getState().favorites).toHaveLength(1);

        useNewsStore.getState().removeFavorite('https://example.com/remove-me');
        expect(useNewsStore.getState().favorites).toHaveLength(0);
    });

    it('should not remove other favorites when removing one', () => {
        const a1 = createMockArticle({ url: 'https://example.com/keep' });
        const a2 = createMockArticle({ url: 'https://example.com/remove' });
        useNewsStore.getState().addFavorite(a1);
        useNewsStore.getState().addFavorite(a2);

        useNewsStore.getState().removeFavorite('https://example.com/remove');
        const { favorites } = useNewsStore.getState();
        expect(favorites).toHaveLength(1);
        expect(favorites[0].url).toBe('https://example.com/keep');
    });

    it('should handle removing a non-existent favorite gracefully', () => {
        const article = createMockArticle({ url: 'https://example.com/exists' });
        useNewsStore.getState().addFavorite(article);

        useNewsStore.getState().removeFavorite('https://example.com/does-not-exist');
        expect(useNewsStore.getState().favorites).toHaveLength(1);
    });

    // ─── Loading State ─────────────────────────────────

    it('should set loading state to true', () => {
        useNewsStore.getState().setLoading(true);
        expect(useNewsStore.getState().isLoading).toBe(true);
    });

    it('should set loading state back to false', () => {
        useNewsStore.getState().setLoading(true);
        useNewsStore.getState().setLoading(false);
        expect(useNewsStore.getState().isLoading).toBe(false);
    });

    // ─── Error State ───────────────────────────────────

    it('should set an error message', () => {
        useNewsStore.getState().setError('Network error');
        expect(useNewsStore.getState().error).toBe('Network error');
    });

    it('should clear the error', () => {
        useNewsStore.getState().setError('Something broke');
        useNewsStore.getState().setError(null);
        expect(useNewsStore.getState().error).toBeNull();
    });

    // ─── Category ──────────────────────────────────────

    it('should initialize with general category', () => {
        expect(useNewsStore.getState().selectedCategory).toBe('general');
    });

    it('should update selected category', () => {
        useNewsStore.getState().setSelectedCategory('technology');
        expect(useNewsStore.getState().selectedCategory).toBe('technology');
    });

    it('should clear search query when category changes', () => {
        useNewsStore.getState().setSearchQuery('bitcoin');
        useNewsStore.getState().setSelectedCategory('sports');
        expect(useNewsStore.getState().searchQuery).toBe('');
        expect(useNewsStore.getState().selectedCategory).toBe('sports');
    });

    // ─── Search Query ──────────────────────────────────

    it('should update search query', () => {
        useNewsStore.getState().setSearchQuery('AI');
        expect(useNewsStore.getState().searchQuery).toBe('AI');
    });

    it('should handle empty search query', () => {
        useNewsStore.getState().setSearchQuery('something');
        useNewsStore.getState().setSearchQuery('');
        expect(useNewsStore.getState().searchQuery).toBe('');
    });

    // ─── Integration: Favorites persist separately ─────

    it('favorites should be independent of articles', () => {
        const fav = createMockArticle({ url: 'https://example.com/fav' });
        const art = createMockArticle({ url: 'https://example.com/art' });

        useNewsStore.getState().addFavorite(fav);
        useNewsStore.getState().setArticles([art]);

        expect(useNewsStore.getState().favorites).toHaveLength(1);
        expect(useNewsStore.getState().articles).toHaveLength(1);
        expect(useNewsStore.getState().favorites[0].url).not.toBe(useNewsStore.getState().articles[0].url);
    });
});
