'use client';

import React from 'react';
import { Flame, Sparkles, MessageCircle, ArrowRight, Tag, Clock } from 'lucide-react';
import { SiteSettings, defaultSiteSettings } from '@/lib/sanity.client';

interface UrgentOfferBannerProps {
  settings?: SiteSettings;
}

export default function UrgentOfferBanner({
  settings = defaultSiteSettings,
}: UrgentOfferBannerProps) {
  if (!settings.showPromoBanner) return null;

  const whatsappNumber = settings.whatsappNumber || '919102609396';
  const tag = settings.promoTag || '🔥 URGENT SELLING OFFER';
  const title =
    settings.promoTitle || 'Flat ₹2,000 Extra Off on all 5G Phones This Week!';
  const description =
    settings.promoDescription ||
    'Free 20W Fast Charger + Original Back Cover with every purchase. Limited stock available at Kolkata Bus Stand, Imamganj counter.';
  const btnText = settings.promoButtonText || 'Claim Offer on WhatsApp';

  const claimUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello! I saw your offer: "${title}". I want to claim this discount on a smartphone.`
  )}`;

  return (
    <div className="relative overflow-hidden my-10 rounded-3xl bg-gradient-to-r from-amber-600/20 via-rose-600/20 to-orange-600/20 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl group">
      {/* Background glow effects */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/30 animate-pulse">
            <Flame className="w-7 h-7 fill-white" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-black tracking-wider uppercase flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1 fill-amber-300" />
                {tag}
              </span>
              <span className="text-[11px] font-bold text-slate-300 flex items-center bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-700">
                <Clock className="w-3 h-3 mr-1 text-amber-400" />
                Limited Time Deal
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {title}
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Right Action CTA */}
        <div className="w-full lg:w-auto shrink-0">
          <a
            href={claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-white text-transparent" />
            <span>{btnText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
