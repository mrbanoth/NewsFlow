import React, { useState } from 'react';
import { Heart, ExternalLink, Calendar, User, ImageOff } from 'lucide-react';
import type { Article } from '../types/news';
import { useNewsStore } from '../store/useNewsStore';
import { cn } from '../utils/cn';

interface NewsCardProps {
    article: Article;
    onClick: (article: Article) => void;
    index: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onClick, index }: NewsCardProps) => {
    const { favorites, addFavorite, removeFavorite } = useNewsStore();
    const isFavorite = favorites.some((f) => f.url === article.url);
    const [imgError, setImgError] = useState(false);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFavorite) {
            removeFavorite(article.url);
        } else {
            addFavorite(article);
        }
    };

    const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const timeAgo = (() => {
        const now = new Date();
        const pub = new Date(article.publishedAt);
        const diffMs = now.getTime() - pub.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
    })();

    return (
        <article
            onClick={() => onClick(article)}
            className="animate-fade-in-up card-hover-glow group bg-white dark:bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50 cursor-pointer flex flex-col h-full"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                {article.urlToImage && !imgError ? (
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
                        <ImageOff className="w-10 h-10" />
                        <span className="text-xs font-medium">No image</span>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    className={cn(
                        "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95",
                        isFavorite
                            ? "bg-white text-red-500 shadow-lg"
                            : "bg-black/20 text-white border border-white/20 hover:bg-white/20"
                    )}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                </button>

                {/* Source Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                        {article.source.name}
                    </span>
                    <span className="bg-black/40 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2 py-1 rounded-lg">
                        {timeAgo}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mb-2.5">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formattedDate}
                    </span>
                    {article.author && (
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                            <User className="w-3 h-3" /> {article.author}
                        </span>
                    )}
                </div>

                <h3 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {article.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 flex-1">
                    {article.description || article.content || "No description available for this article."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-blue-600 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                        Read article <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </article>
    );
};
