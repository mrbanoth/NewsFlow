import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Heart, Newspaper, Share2 } from 'lucide-react';
import type { Article } from '../types/news';
import { useNewsStore } from '../store/useNewsStore';
import { cn } from '../utils/cn';

interface ArticleModalProps {
    article: Article | null;
    onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }: ArticleModalProps) => {
    const { favorites, addFavorite, removeFavorite } = useNewsStore();

    // Lock body scroll when modal is open
    useEffect(() => {
        if (article) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [article]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!article) return null;

    const isFavorite = favorites.some((f) => f.url === article.url);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(article.url);
        } else {
            addFavorite(article);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: article.title, url: article.url });
            } catch { /* user cancelled */ }
        } else {
            navigator.clipboard.writeText(article.url);
        }
    };

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDuration: '0.15s' }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative bg-white dark:bg-slate-900 w-full sm:w-[95%] max-w-4xl sm:max-h-[90vh] max-h-[95vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fade-in-up"
                style={{ animationDuration: '0.25s' }}
            >
                {/* Floating Action Bar */}
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <button
                        onClick={handleShare}
                        className="p-2.5 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all"
                        aria-label="Share article"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleFavorite}
                        className={cn(
                            "p-2.5 rounded-full backdrop-blur-md transition-all",
                            isFavorite
                                ? "bg-white text-red-500 shadow-lg"
                                : "bg-black/30 text-white hover:bg-black/50"
                        )}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all"
                        aria-label="Close details"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto overscroll-contain">
                    {/* Cover Image */}
                    <div className="relative w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <div className="aspect-[16/7] sm:aspect-[21/9]">
                            {article.urlToImage ? (
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                    <Newspaper className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        {/* Bottom gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
                    </div>

                    {/* Article Body */}
                    <div className="px-5 sm:px-8 pb-8 sm:pb-12 -mt-10 sm:-mt-14 relative">
                        {/* Source Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                                {article.source.name}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-5 leading-tight">
                            {article.title}
                        </h2>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formattedDate}</span>
                            </div>
                            {article.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="truncate max-w-[200px]">{article.author}</span>
                                </div>
                            )}
                        </div>


                        {/* Description */}
                        {article.description && (
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 font-medium leading-relaxed">
                                {article.description}
                            </p>
                        )}

                        {/* Content */}
                        <div className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                            {article.content?.split('[+')[0] || "The full content of this article is available at the source. Click below to read more."}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-2.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold sm:font-bold rounded-xl sm:rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                            >
                                Read Full Article <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                                onClick={onClose}
                                className="px-4 sm:px-8 py-2.5 sm:py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm sm:text-base font-semibold sm:font-bold rounded-xl sm:rounded-2xl transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
