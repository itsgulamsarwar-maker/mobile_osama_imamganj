'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Check,
  Tag,
  ArrowUpDown,
  Flame,
  MessageCircle,
  X,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';
import MobileCard from './MobileCard';
import MobileGalleryModal from './MobileGalleryModal';

const BRAND_LIST = [
  { name: 'All', icon: '⚡' },
  { name: 'Apple', icon: '🍎' },
  { name: 'Samsung', icon: '📱' },
  { name: 'OnePlus', icon: '🔴' },
  { name: 'Vivo', icon: '✨' },
  { name: 'Realme', icon: '🟡' },
  { name: 'Xiaomi', icon: '🟠' },
  { name: 'Google', icon: '🔍' },
  { name: 'Other', icon: '📦' },
];

const BUDGET_FILTERS = [
  { label: 'All Budgets', min: 0, max: Infinity },
  { label: 'Under ₹20,000', min: 0, max: 20000 },
  { label: '₹20k - ₹35k', min: 20000, max: 35000 },
  { label: '₹35k - ₹50k', min: 35000, max: 50000 },
  { label: 'Flagship ₹50k+', min: 50000, max: Infinity },
];

interface CatalogViewProps {
  initialMobiles: MobileItem[];
  whatsappNumber?: string;
}

export default function CatalogView({
  initialMobiles,
  whatsappNumber = '919102609396',
}: CatalogViewProps) {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyUrgentSales, setOnlyUrgentSales] = useState(false);
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(0);
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

  // Brand item counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialMobiles.length };
    BRAND_LIST.slice(1).forEach((b) => {
      counts[b.name] = initialMobiles.filter((m) => m.brand === b.name).length;
    });
    return counts;
  }, [initialMobiles]);

  // Filter and sort logic
  const filteredMobiles = useMemo(() => {
    const activeBudget = BUDGET_FILTERS[selectedBudgetIndex];

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

        // In Stock filter
        if (onlyInStock && item.isSold) {
          return false;
        }

        // Urgent Deals filter
        if (onlyUrgentSales && !item.isUrgentSale) {
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
    searchQuery,
    onlyInStock,
    onlyUrgentSales,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedBrand('All');
    setSelectedBudgetIndex(0);
    setSearchQuery('');
    setOnlyInStock(false);
    setOnlyUrgentSales(false);
    setSortBy('latest');
  };

  const isFilterActive =
    selectedBrand !== 'All' ||
    selectedBudgetIndex !== 0 ||
    onlyInStock ||
    onlyUrgentSales ||
    searchQuery.trim().length > 0;

  return (
    <div id="catalog-section" className="scroll-mt-24">
      {/* Modern App Search & Filter Header */}
      <div className="space-y-3 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-emerald-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search iPhone, Samsung, OnePlus, Vivo..."
            className="w-full pl-10 pr-10 py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-white/[0.09] focus:border-emerald-500/60 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Brand Stories / Tabs Bar (Horizontal Swipe) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {BRAND_LIST.map((brand) => {
            const isSelected = selectedBrand === brand.name;
            const count = brandCounts[brand.name] || 0;
            return (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]'
                }`}
              >
                <span className="text-xs">{brand.icon}</span>
                <span>{brand.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white/[0.06] text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Quick Pills (Urgent Deals, In Stock, Budgets) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-xs">
          {/* Urgent Deals Toggle */}
          <button
            onClick={() => setOnlyUrgentSales(!onlyUrgentSales)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
              onlyUrgentSales
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/25 border border-rose-400/40'
                : 'bg-white/[0.03] hover:bg-white/[0.06] text-amber-400/90 border border-amber-500/30'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyUrgentSales ? 'fill-white' : 'fill-amber-400'}`} />
            <span>Urgent Deals</span>
          </button>

          {/* In Stock Toggle */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
              onlyInStock
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.07]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                onlyInStock
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : 'border-slate-600'
              }`}
            >
              {onlyInStock && <Check className="w-2.5 h-2.5" />}
            </div>
            <span>In Stock</span>
          </button>

          {/* Budget Pills */}
          {BUDGET_FILTERS.map((b, idx) => {
            const isSelected = selectedBudgetIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedBudgetIndex(idx)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 border border-white/[0.07]'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Results Bar / Sort / Reset */}
        <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>
              <strong className="text-white font-extrabold">{filteredMobiles.length}</strong> phones available
            </span>
            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold ml-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort phones"
              className="bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="latest" className="bg-slate-900 text-slate-100">Latest Stock</option>
              <option value="price-asc" className="bg-slate-900 text-slate-100">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900 text-slate-100">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobiles Card Grid */}
      {filteredMobiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl my-8">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
            {searchQuery ? `"${searchQuery}" Not in Current Stock` : 'No Phones Match Filters'}
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            {searchQuery
              ? `Yeh phone abhi counter pe available nahi hai, lekin Osama bhaiya aapke liye arrange karwa sakte hain!`
              : 'Try resetting filters or search for another phone model.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-bold text-xs transition-colors border border-white/[0.08]"
            >
              Show All Stock
            </button>

            {searchQuery && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hi Osama! I was looking for "${searchQuery}" on your website. Can you check if it is available or arrange it?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>Ask on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <MobileGalleryModal
        mobile={galleryMobile}
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        initialIndex={galleryIndex}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
