'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Check,
  Flame,
  MessageCircle,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';
import MobileCard from './MobileCard';
import MobileGalleryModal from './MobileGalleryModal';

const BRANDS = [
  'All',
  'Apple',
  'Samsung',
  'OnePlus',
  'Vivo',
  'Realme',
  'Xiaomi',
  'Google',
  'Other',
];

const BUDGET_RANGES = [
  { label: 'All Budgets', min: 0, max: Infinity },
  { label: 'Under ₹20,000', min: 0, max: 20000 },
  { label: '₹20,000 - ₹35,000', min: 20000, max: 35000 },
  { label: '₹35,000 - ₹50,000', min: 35000, max: 50000 },
  { label: 'Flagship Above ₹50,000', min: 50000, max: Infinity },
];

const CONDITIONS = ['All', 'Like New (10/10)', 'Good'];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest Stock' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc'>('latest');

  // Filter Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    BRANDS.slice(1).forEach((b) => {
      counts[b] = initialMobiles.filter((m) => m.brand === b).length;
    });
    return counts;
  }, [initialMobiles]);

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
    selectedCondition,
    searchQuery,
    onlyInStock,
    onlyUrgentSales,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedBrand('All');
    setSelectedBudgetIndex(0);
    setSelectedCondition('All');
    setSearchQuery('');
    setOnlyInStock(false);
    setOnlyUrgentSales(false);
    setSortBy('latest');
  };

  const activeFilterCount =
    (selectedBrand !== 'All' ? 1 : 0) +
    (selectedBudgetIndex !== 0 ? 1 : 0) +
    (selectedCondition !== 'All' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyUrgentSales ? 1 : 0);

  return (
    <div id="catalog-section" className="scroll-mt-24">
      {/* 1. Main Search & Filter Action Bar */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iPhone, Galaxy, Vivo, 128GB..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-white/[0.09] focus:border-emerald-500/60 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Professional Filter Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 sm:py-3 rounded-2xl text-xs font-bold border transition-all active:scale-95 shrink-0 shadow-sm ${
              activeFilterCount > 0
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.09]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* 2. Professional Brand Horizontal Carousel */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand === brand;
            const count = brandCounts[brand] || 0;
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 border border-white/[0.06]'
                }`}
              >
                <span>{brand}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.05] text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Active Filters Dismissible Tags (If Any Filter Active) */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Active:</span>

            {selectedBrand !== 'All' && (
              <button
                onClick={() => setSelectedBrand('All')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
              >
                <span>{selectedBrand}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {selectedBudgetIndex !== 0 && (
              <button
                onClick={() => setSelectedBudgetIndex(0)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold"
              >
                <span>{BUDGET_RANGES[selectedBudgetIndex].label}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {selectedCondition !== 'All' && (
              <button
                onClick={() => setSelectedCondition('All')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] text-slate-300 text-[11px]"
              >
                <span>{selectedCondition}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {onlyUrgentSales && (
              <button
                onClick={() => setOnlyUrgentSales(false)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold"
              >
                <span>🔥 Urgent Deals</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {onlyInStock && (
              <button
                onClick={() => setOnlyInStock(false)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
              >
                <span>In Stock Only</span>
                <X className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={resetFilters}
              className="text-[11px] text-slate-400 hover:text-rose-400 font-bold ml-1 transition-colors underline underline-offset-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 4. Results Count & Sort Dropdown */}
        <div className="flex items-center justify-between pt-1 px-0.5 text-xs text-slate-400">
          <span>
            <strong className="text-white font-black">{filteredMobiles.length}</strong> phones available
          </span>

          <div className="flex items-center space-x-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort phones"
              className="bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5. Mobiles Grid */}
      {filteredMobiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMobiles.map((mobile) => (
            <MobileCard
              key={mobile._id}
              mobile={mobile}
              onOpenGallery={handleOpenGallery}
              whatsappNumber={whatsappNumber}
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
              ? 'Yeh phone abhi counter pe available nahi hai, lekin hum aapke liye arrange karwa sakte hain!'
              : 'Try clearing filters to see all available stock.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-bold text-xs transition-colors border border-white/[0.08]"
            >
              Reset Filters
            </button>

            {searchQuery && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello! I was looking for "${searchQuery}" on 2nd Hand Mobile Hub website. Can you check if it is available or arrange it?`
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

      {/* 6. Professional Filter Menu Drawer (Bottom Sheet on Mobile, Modal on Desktop) */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-[#0b101d] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-heading text-base font-bold text-white">Filter & Sort Phones</h3>
              </div>
              <div className="flex items-center space-x-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                  >
                    Reset All
                  </button>
                )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
              {/* Brand Filter */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Select Brand:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BRANDS.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    const count = brandCounts[brand] || 0;
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                            : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/[0.06]'
                        }`}
                      >
                        <span className="truncate">{brand}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                            isSelected ? 'bg-emerald-500/40 text-white' : 'text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Range Filter */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Price / Budget Range:
                </label>
                <div className="space-y-1.5">
                  {BUDGET_RANGES.map((b, idx) => {
                    const isSelected = selectedBudgetIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedBudgetIndex(idx)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                            : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/[0.06]'
                        }`}
                      >
                        <span>{b.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Physical Condition:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CONDITIONS.map((cond) => {
                    const isSelected = selectedCondition === cond;
                    return (
                      <button
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border-white/[0.06]'
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Toggles */}
              <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
                <button
                  onClick={() => setOnlyUrgentSales(!onlyUrgentSales)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${
                    onlyUrgentSales
                      ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-200 border-amber-500/50'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Flame className={`w-4 h-4 ${onlyUrgentSales ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    <span>🔥 Urgent Clearance Deals Only</span>
                  </div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${onlyUrgentSales ? 'bg-amber-500 border-amber-400 text-white' : 'border-slate-600'}`}>
                    {onlyUrgentSales && <Check className="w-3 h-3" />}
                  </div>
                </button>

                <button
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${
                    onlyInStock
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>In Stock Only (Hide Sold Out)</span>
                  </div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${onlyInStock ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-600'}`}>
                    {onlyInStock && <Check className="w-3 h-3" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Drawer Footer (Sticky CTA) */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0b101d] safe-area-bottom">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <span>Apply Filters</span>
                <span>•</span>
                <span>{filteredMobiles.length} Phones Match</span>
              </button>
            </div>
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
