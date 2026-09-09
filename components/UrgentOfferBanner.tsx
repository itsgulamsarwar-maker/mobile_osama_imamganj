'use client';

import React from 'react';
import { Flame, MessageCircle, ArrowRight, Clock } from 'lucide-react';
import { SiteSettings, defaultSiteSettings } from '@/lib/sanity.client';

interface UrgentOfferBannerProps {
  settings?: SiteSettings;
}

export default function UrgentOfferBanner({
  settings = defaultSiteSettings,
}: UrgentOfferBannerProps) {
  if (!settings.showPromoBanner) return null;

  const whatsappNumber = settings.whatsappNumber || '919102609396';
  const tag = settings.promoTag || '🔥 URGENT DEAL';
  const title =
    settings.promoTitle || 'Flat ₹2,000 Extra Off on all 5G Phones This Week!';
  const description =
    settings.promoDescription ||
    'Free 20W Fast Charger + Original Back Cover with every purchase. Limited stock available at Kolkata Bus Stand, Imamganj counter.';
  const btnText = settings.promoButtonText || 'Claim on WhatsApp';

  const claimUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Osama! I saw your offer: "${title}". I want to claim this deal on a smartphone.`
  )}`;

  return (
    <div className="relative overflow-hidden my-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-orange-500/10 border border-amber-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/20">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black tracking-wider uppercase">
                {tag}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 flex items-center">
                <Clock className="w-3 h-3 mr-1 text-amber-400" />
                Limited Stock
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
              {title}
            </h3>

            <p className="mt-0.5 text-xs text-slate-300 leading-relaxed max-w-2xl hidden sm:block">
              {description}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <a
            href={claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-transparent" />
            <span>{btnText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
