import { describe, it, expect, beforeEach } from 'vitest';
import { useNewsStore } from '../store/useNewsStore';

describe('useNewsStore', () => {
    beforeEach(() => {
        // Reset state manually if needed, but Zustand with persist might need more care in tests
        // For simple unit tests, we'll just test the core actions
    });

    it('should initialize with empty articles', () => {
        const state = useNewsStore.getState();
        expect(state.articles).toEqual([]);
    });

    it('should add an article to favorites', () => {
        const article = {
            source: { id: 'techcrunch', name: 'TechCrunch' },
            author: 'John Doe',
            title: 'Breaking News',
            description: 'Something happened',
            url: 'https://example.com/breaking',
            urlToImage: null,
            publishedAt: '2024-01-01T00:00:00Z',
            content: 'Full content here',
        };

        const { addFavorite } = useNewsStore.getState();
        addFavorite(article);

        const { favorites } = useNewsStore.getState();
        expect(favorites).toContainEqual(article);
    });

    it('should remove an article from favorites', () => {
        const url = 'https://example.com/breaking';
        const { removeFavorite } = useNewsStore.getState();

        removeFavorite(url);

        const newState = useNewsStore.getState();
        expect(newState.favorites.some(f => f.url === url)).toBe(false);
    });

    it('should update search query', () => {
        const query = 'Artificial Intelligence';
        const { setSearchQuery } = useNewsStore.getState();

        setSearchQuery(query);

        const { searchQuery } = useNewsStore.getState();
        expect(searchQuery).toBe(query);
    });
});
