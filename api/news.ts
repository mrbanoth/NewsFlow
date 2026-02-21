import type { VercelRequest, VercelResponse } from '@vercel/node';

const NEWS_API_BASE = 'https://newsapi.org/v2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.VITE_NEWS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const { endpoint, ...params } = req.query;

    if (!endpoint || typeof endpoint !== 'string') {
        return res.status(400).json({ error: 'Missing endpoint parameter (top-headlines or everything)' });
    }

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set('apiKey', apiKey);
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') {
            queryParams.set(key, value);
        }
    }

    try {
        const response = await fetch(`${NEWS_API_BASE}/${endpoint}?${queryParams.toString()}`);
        const data = await response.json();

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

        return res.status(response.status).json(data);
    } catch {
        return res.status(500).json({ error: 'Failed to fetch from NewsAPI' });
    }
}
