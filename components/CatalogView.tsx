'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  RefreshCcw,
  Sparkles,
  Check,
  Tag,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';
import MobileCard from './MobileCard';
import MobileGalleryModal from './MobileGalleryModal';

const BRANDS = [
  'All',
  'Apple',
  'Samsung',
  'OnePlus',
  'Xiaomi',
  'Vivo',
  'Oppo',
  'Realme',
  'Google',
  'Other',
];

const BUDGET_RANGES = [
  { label: 'All Budgets', min: 0, max: Infinity },
  { label: 'Under ₹35,000', min: 0, max: 35000 },
  { label: '₹35k - ₹50k', min: 35000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity },
];

const POPULAR_TAGS = ['iPhone', 'Galaxy S23', 'OnePlus 11', 'Pixel', '128GB', '256GB'];

interface CatalogViewProps {
  initialMobiles: MobileItem[];
}

export default function CatalogView({ initialMobiles }: CatalogViewProps) {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc'>('latest');

  // Modal Gallery state
  const [galleryMobile, setGalleryMobile] = useState<MobileItem | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleOpenGallery = (mobile: MobileItem, index = 0) => {
    setGalleryMobile(mobile);
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setGalleryMobile(null);
  };

  // Filter and sort logic
  const filteredMobiles = useMemo(() => {
    const activeBudget = BUDGET_RANGES[selectedBudgetIndex];

    return initialMobiles
      .filter((item) => {
        // Brand filter
        if (selectedBrand !== 'All' && item.brand !== selectedBrand) {
          return false;
        }

        // Budget filter
        if (item.price < activeBudget.min || item.price > activeBudget.max) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
          return false;
        }

        // In Stock filter
        if (onlyInStock && item.isSold) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchVariant = item.variant?.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          const matchCondition = item.condition?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchVariant && !matchBrand && !matchCondition && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        const dateA = a._createdAt ? new Date(a._createdAt).getTime() : 0;
        const dateB = b._createdAt ? new Date(b._createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [
    initialMobiles,
    selectedBrand,
    selectedBudgetIndex,
    selectedCondition,
    searchQuery,
    onlyInStock,
    sortBy,
  ]);

  // Brand item counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialMobiles.length };
    BRANDS.slice(1).forEach((b) => {
      counts[b] = initialMobiles.filter((m) => m.brand === b).length;
    });
    return counts;
  }, [initialMobiles]);

  const resetFilters = () => {
    setSelectedBrand('All');
    setSelectedBudgetIndex(0);
    setSelectedCondition('All');
    setSearchQuery('');
    setOnlyInStock(false);
    setSortBy('latest');
  };

  const activeFilterCount =
    (selectedBrand !== 'All' ? 1 : 0) +
    (selectedBudgetIndex !== 0 ? 1 : 0) +
    (selectedCondition !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  return (
    <div id="catalog-section">
      {/* Filter Control Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl mb-10 backdrop-blur-xl">
        {/* Search Bar & Primary Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model (e.g. iPhone 14 Pro, Galaxy S23, 256GB)..."
              className="w-full pl-12 pr-12 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Stock Toggle & Sort */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`inline-flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${
                onlyInStock
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  onlyInStock
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'border-slate-600'
                }`}
              >
                {onlyInStock && <Check className="w-3 h-3" />}
              </div>
              <span>In Stock Only</span>
            </button>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort phones by price or newest"
                className="bg-slate-950/80 border border-slate-700/80 text-slate-200 font-bold text-xs rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="latest">Latest Stock</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin text-xs text-slate-400">
          <span className="shrink-0 text-[11px] font-bold text-slate-500 flex items-center">
            <Tag className="w-3 h-3 mr-1" /> Quick:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 text-[11px] font-medium transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Brand Filter Tags */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Filter by Brand:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand;
              const count = brandCounts[brand] || 0;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{brand}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2">
            Budget:
          </span>
          {BUDGET_RANGES.map((budget, idx) => {
            const isSelected = selectedBudgetIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedBudgetIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {budget.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-white font-bold">{filteredMobiles.length}</strong>{' '}
              {filteredMobiles.length === 1 ? 'phone' : 'phones'} available
            </span>
            {activeFilterCount > 0 && (
              <span className="text-emerald-400 font-semibold">
                • {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-rose-400 font-bold transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobiles Grid */}
      {filteredMobiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMobiles.map((mobile) => (
            <MobileCard
              key={mobile._id}
              mobile={mobile}
              onOpenGallery={handleOpenGallery}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-2xl my-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white mb-2">No Phones Match Your Filters</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            We couldn't find any phone matching your exact budget and search criteria.
            Try clearing filters or search for another model.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20"
          >
            Clear All Filters & Show All
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <MobileGalleryModal
        mobile={galleryMobile}
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        initialIndex={galleryIndex}
      />
    </div>
  );
}
