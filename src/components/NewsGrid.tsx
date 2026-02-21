import React from 'react';
import { NewsCard } from './NewsCard';
import type { Article } from '../types/news';
import { SearchX } from 'lucide-react';

interface NewsGridProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
    title?: string;
    emptyMessage?: string;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ articles, onArticleClick, title, emptyMessage }: NewsGridProps) => {
    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                    <SearchX className="w-10 h-10 opacity-40" />
                </div>
                <p className="text-lg font-semibold mb-1">{emptyMessage || 'No articles found'}</p>
                <p className="text-sm text-slate-400">Try a different category or search term.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {title && (
                <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">{title}</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {articles.map((article: Article, index: number) => (
                    <NewsCard
                        key={`${article.url}-${index}`}
                        article={article}
                        onClick={onArticleClick}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};
