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
  Sparkles,
  Package,
  Receipt,
  Zap,
  BellRing,
  Flame,
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

  // Calculate discount percentage and savings in INR
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
  const savingsAmount =
    originalPrice && originalPrice > price ? originalPrice - price : null;

  // Pre-filled WhatsApp URLs
  const storePhone = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919102609396';
  const whatsappQuery = encodeURIComponent(
    `Hello! I am interested in buying *${title}* (${variant}) listed for *₹${price.toLocaleString(
      'en-IN'
    )}* [Condition: ${condition}, Battery: ${batteryHealth || 'N/A'}${
      isUrgentSale ? ' - Urgent Sale Offer' : ''
    }]. Is this still available?`
  );
  const whatsappUrl = `https://wa.me/${storePhone}?text=${whatsappQuery}`;

  const restockNotifyUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(
    `Hello! I saw *${title}* was Sold Out on your website. Please notify me when similar stock arrives.`
  )}`;

  // Condition Grade & Score
  const getConditionDetails = (cond: string) => {
    switch (cond) {
      case 'Like New (10/10)':
        return {
          label: 'Grade A+ • Mint Condition',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          barColor: 'bg-emerald-500',
          percentage: '100%',
        };
      case 'Good':
        return {
          label: 'Grade A • Minor Wear',
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          barColor: 'bg-cyan-500',
          percentage: '85%',
        };
      default:
        return {
          label: 'Grade B • Value Pick',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          barColor: 'bg-amber-500',
          percentage: '70%',
        };
    }
  };

  const condDetails = getConditionDetails(condition);

  return (
    <div
      className={`group relative flex flex-col bg-slate-900/80 border rounded-3xl transition-all duration-300 overflow-hidden ${
        isSold
          ? 'border-slate-800 opacity-80'
          : isUrgentSale
          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 hover:border-amber-400 hover:shadow-glow-emerald hover:-translate-y-1'
          : 'border-slate-800/90 hover:border-emerald-500/40 hover:shadow-glow-emerald hover:-translate-y-1'
      }`}
    >
      {/* Media Box */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-800/40 to-slate-950/60 overflow-hidden cursor-pointer">
        {primaryImageSrc ? (
          <Image
            src={primaryImageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-4 transition-transform duration-500 ${
              isSold ? 'grayscale contrast-75' : 'group-hover:scale-105'
            }`}
            onClick={() => onOpenGallery(mobile, 0)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-900"
            onClick={() => onOpenGallery(mobile, 0)}
          >
            No Image
          </div>
        )}

        {/* Brand Tag (Top Left) */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center space-x-1.5">
          <span className="px-3 py-1 text-xs font-black rounded-xl bg-slate-950/90 backdrop-blur-md text-white tracking-wider uppercase border border-slate-700/80">
            {brand}
          </span>
          {isUrgentSale && !isSold && (
            <span className="px-2.5 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white tracking-wider uppercase shadow-lg shadow-rose-500/30 flex items-center animate-pulse">
              <Flame className="w-3 h-3 mr-1 fill-white" />
              Urgent Sale
            </span>
          )}
        </div>

        {/* Gallery count trigger (Top Right) */}
        {photoCount > 0 && (
          <button
            onClick={() => onOpenGallery(mobile, 0)}
            className="absolute top-3.5 right-3.5 z-10 flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors"
            title="View photo gallery"
          >
            <Images className="w-3.5 h-3.5 text-emerald-400" />
            <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
          </button>
        )}

        {/* Sold Out Overlay */}
        {isSold && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] p-4 text-center">
            <div className="rotate-[-6deg] px-5 py-2 rounded-xl bg-rose-600 text-white font-black text-sm tracking-widest uppercase border-2 border-white/90 shadow-2xl mb-2">
              Sold Out
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Just Sold • Next piece arriving soon</p>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Title and Condition Tag */}
        <div className="mb-2">
          <h3 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-slate-400 font-medium">{variant}</p>
        </div>

        {/* Condition Rating Meter */}
        <div className="mb-3.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-400 font-medium">{condDetails.label}</span>
            <span className="font-bold text-emerald-400">{condition}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${condDetails.barColor} rounded-full transition-all duration-500`}
              style={{ width: condDetails.percentage }}
            />
          </div>
        </div>

        {/* Key Metrics: Battery & Warranty */}
        <div className="flex items-center gap-2 mb-3.5 text-xs">
          {batteryHealth && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold">
              <Battery className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              {batteryHealth}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" />
            7-Day Replacement
          </span>
        </div>

        {/* Included Items Checklist */}
        {includes && includes.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Includes in Box:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {includes.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mr-1" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description brief if available */}
        {description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed italic">
            "{description}"
          </p>
        )}

        {/* Pricing Box */}
        <div className="mt-auto pt-3 border-t border-slate-800/90">
          <div className="flex items-baseline justify-between mb-3.5">
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
                <span className="text-[11px] font-bold text-emerald-400">
                  Save ₹{savingsAmount.toLocaleString('en-IN')} vs New
                </span>
              )}
            </div>

            {discountPercent !== null && discountPercent > 0 && (
              <span className="px-2.5 py-1 text-xs font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            {isSold ? (
              <a
                href={restockNotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Notify Me on Restock</span>
              </a>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-black text-xs sm:text-sm shadow-lg transition-all transform active:scale-[0.99] ${
                  isUrgentSale
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-amber-500/25'
                    : 'bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#16a34a] shadow-emerald-500/20'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>
                  {isUrgentSale ? 'Claim Urgent Deal on WhatsApp' : 'Chat on WhatsApp to Buy'}
                </span>
              </a>
            )}

            <button
              onClick={() => onOpenGallery(mobile, 0)}
              className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>View HD Photos & Specs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
