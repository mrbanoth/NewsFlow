import React from 'react';
import { Globe, Monitor, Briefcase, Trophy, FlaskConical, HeartPulse, Clapperboard } from 'lucide-react';
import { useNewsStore } from '../store/useNewsStore';
import type { Category } from '../types/news';
import { cn } from '../utils/cn';

const categories: { label: string; value: Category; icon: React.ReactNode }[] = [
    { label: 'General', value: 'general', icon: <Globe className="w-4 h-4" /> },
    { label: 'Technology', value: 'technology', icon: <Monitor className="w-4 h-4" /> },
    { label: 'Business', value: 'business', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Sports', value: 'sports', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Science', value: 'science', icon: <FlaskConical className="w-4 h-4" /> },
    { label: 'Health', value: 'health', icon: <HeartPulse className="w-4 h-4" /> },
    { label: 'Entertainment', value: 'entertainment', icon: <Clapperboard className="w-4 h-4" /> },
];

export const CategoryBar: React.FC = () => {
    const { selectedCategory, setSelectedCategory, setSearchQuery } = useNewsStore();

    const handleCategoryClick = (value: Category) => {
        setSelectedCategory(value);
        setSearchQuery('');
    };

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategoryClick(cat.value)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200",
                                selectedCategory === cat.value
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            )}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
