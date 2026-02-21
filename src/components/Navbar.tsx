import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, X, Newspaper } from 'lucide-react';
import { useNewsStore } from '../store/useNewsStore';
import { cn } from '../utils/cn';

interface NavbarProps {
    onToggleFavorites: () => void;
    showFavorites: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleFavorites, showFavorites }: NavbarProps) => {
    const { setSearchQuery, favorites } = useNewsStore();
    const [searchValue, setSearchValue] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    // Live search with debounce
    useEffect(() => {
        if (searchValue.trim() === '') {
            setSearchQuery('');
            return;
        }
        debounceRef.current = setTimeout(() => {
            setSearchQuery(searchValue.trim());
        }, 500);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchValue, setSearchQuery]);

    // Auto-focus when mobile search opens
    useEffect(() => {
        if (showMobileSearch) {
            setTimeout(() => mobileInputRef.current?.focus(), 100);
        }
    }, [showMobileSearch]);

    const handleClearSearch = () => {
        setSearchValue('');
        setSearchQuery('');
    };

    const closeMobileSearch = () => {
        setShowMobileSearch(false);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleClearSearch}>
                            <Newspaper className="w-6 h-6 text-slate-900 dark:text-white" />
                            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                NewsFlow
                            </span>
                        </div>

                        {/* Desktop: Search Bar */}
                        <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
                            <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search news..."
                                    className="w-full pl-10 pr-9 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setShowMobileSearch(!showMobileSearch)}
                                className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Favorites */}
                            <button
                                onClick={onToggleFavorites}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                    showFavorites
                                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <Heart className={cn("w-4 h-4", favorites.length > 0 && "fill-red-500 text-red-500")} />
                                <span className="hidden sm:inline">{showFavorites ? 'Back' : 'Favorites'}</span>
                                {favorites.length > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {favorites.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search — drops down from navbar */}
                {showMobileSearch && (
                    <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 search-dropdown">
                        <div className="px-3 py-2 flex items-center gap-2">
                            <form onSubmit={(e) => e.preventDefault()} className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    ref={mobileInputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search news..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-400"
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                )}
                            </form>
                            <button
                                onClick={closeMobileSearch}
                                className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};
