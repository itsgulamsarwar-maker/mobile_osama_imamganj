'use client';

import React from 'react';
import Image from 'next/image';
import {
  MessageCircle,
  Battery,
  ShieldCheck,
  CheckCircle2,
  Images,
  Info,
  Flame,
  BellRing,
  Sparkles,
} from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';
import { getImageSrc } from '@/lib/sanity.image';

interface MobileCardProps {
  mobile: MobileItem;
  onOpenGallery: (mobile: MobileItem, index?: number) => void;
}

export default function MobileCard({ mobile, onOpenGallery }: MobileCardProps) {
  const {
    title,
    brand,
    price,
    originalPrice,
    isUrgentSale = false,
    variant,
    condition,
    batteryHealth,
    includes = [],
    images = [],
    isSold = false,
    description,
  } = mobile;

  const primaryImageSrc = images && images.length > 0 ? getImageSrc(images[0]) : '';
  const photoCount = images ? images.length : 0;

  // Calculate discount percentage & savings
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
  const savingsAmount =
    originalPrice && originalPrice > price ? originalPrice - price : null;

  const storePhone = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919102609396';
  const whatsappQuery = encodeURIComponent(
    `Hello Osama! I am interested in buying *${title}* (${variant}) listed for *₹${price.toLocaleString(
      'en-IN'
    )}* [Condition: ${condition}, Battery: ${batteryHealth || 'N/A'}${
      isUrgentSale ? ' - Urgent Sale' : ''
    }]. Is this still available?`
  );
  const whatsappUrl = `https://wa.me/${storePhone}?text=${whatsappQuery}`;

  const restockNotifyUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(
    `Hello Osama! I saw *${title}* was Sold Out on your website. Please notify me when similar stock arrives.`
  )}`;

  return (
    <div
      className={`group relative flex flex-col rounded-3xl transition-all duration-300 overflow-hidden ${
        isSold
          ? 'bg-[#0f1422]/60 border border-white/[0.05] opacity-75'
          : isUrgentSale
          ? 'bg-gradient-to-b from-[#151c2e] to-[#0d1220] border border-amber-500/40 shadow-xl shadow-amber-500/5 hover:border-amber-400 hover:-translate-y-1'
          : 'bg-gradient-to-b from-[#121828] to-[#0c101c] border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1'
      }`}
    >
      {/* Product Image Stage */}
      <div
        className="relative w-full aspect-[4/3] bg-gradient-to-b from-white/[0.02] to-black/30 overflow-hidden cursor-pointer flex items-center justify-center p-3"
        onClick={() => onOpenGallery(mobile, 0)}
      >
        {primaryImageSrc ? (
          <Image
            src={primaryImageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-4 transition-transform duration-500 ${
              isSold ? 'grayscale contrast-75' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            No Image
          </div>
        )}

        {/* Top Badges (Brand & Urgent Sale) */}
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-xl bg-black/70 backdrop-blur-md text-white border border-white/10 tracking-wide uppercase">
            {brand}
          </span>
          {isUrgentSale && !isSold && (
            <span className="px-2 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white uppercase tracking-wider shadow-lg shadow-rose-500/30 flex items-center animate-pulse">
              <Flame className="w-3 h-3 mr-0.5 fill-white" />
              Flash Deal
            </span>
          )}
        </div>

        {/* Photos Count Pill */}
        {photoCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenGallery(mobile, 0);
            }}
            className="absolute top-3 right-3 z-10 flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-slate-200 text-[11px] font-semibold border border-white/10 transition-colors"
          >
            <Images className="w-3.5 h-3.5 text-emerald-400" />
            <span>{photoCount}</span>
          </button>
        )}

        {/* Sold Out Overlay */}
        {isSold && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[2px] p-4 text-center">
            <div className="rotate-[-6deg] px-4 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs tracking-widest uppercase border-2 border-white/90 shadow-2xl mb-1.5">
              Sold Out
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Just Sold • Arriving soon</p>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title & Storage */}
        <div className="mb-2.5">
          <h3 className="font-extrabold text-white text-base sm:text-lg group-hover:text-emerald-300 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
            {variant}
          </p>
        </div>

        {/* Micro Specs Tags (Battery, Warranty, Condition) */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5 text-[11px]">
          {batteryHealth && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
              <Battery className="w-3 h-3 mr-1 text-emerald-400" />
              {batteryHealth}
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06] font-medium">
            <ShieldCheck className="w-3 h-3 mr-1 text-teal-400" />
            7-Day Testing
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06] font-medium">
            {condition}
          </span>
        </div>

        {/* In Box Items */}
        {includes && includes.length > 0 && (
          <div className="mb-3.5 flex flex-wrap gap-1">
            {includes.map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05]"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        )}

        {/* Pricing Box */}
        <div className="mt-auto pt-3 border-t border-white/[0.06]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white tracking-tight">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs font-medium text-slate-500 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {savingsAmount && savingsAmount > 0 && (
                <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">
                  Save ₹{savingsAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {discountPercent !== null && discountPercent > 0 && (
              <span className="px-2 py-0.5 text-xs font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-lg">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {isSold ? (
              <a
                href={restockNotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 font-bold text-xs border border-white/[0.08] transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Notify Me on Restock</span>
              </a>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-white font-black text-xs sm:text-sm shadow-lg transition-all transform active:scale-[0.98] ${
                  isUrgentSale
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-amber-500/25'
                    : 'bg-[#25D366] hover:bg-[#1EBE5D] shadow-emerald-600/25'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>
                  {isUrgentSale ? 'Claim Deal on WhatsApp' : 'Chat on WhatsApp to Buy'}
                </span>
              </a>
            )}

            <button
              onClick={() => onOpenGallery(mobile, 0)}
              className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white text-xs font-semibold border border-white/[0.06] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Photos & Inspection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
