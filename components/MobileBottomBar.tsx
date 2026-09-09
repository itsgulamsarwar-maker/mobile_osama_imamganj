'use client';

import React from 'react';
import { Home, Search, Phone, MessageCircle, MapPin } from 'lucide-react';
import { SiteSettings, defaultSiteSettings } from '@/lib/sanity.client';

interface MobileBottomBarProps {
  settings?: SiteSettings;
}

export default function MobileBottomBar({
  settings = defaultSiteSettings,
}: MobileBottomBarProps) {
  const whatsappNumber = settings.whatsappNumber || '919102609396';
  const storePhone = settings.phone || '+91 9102609396';
  const storeAddress = settings.address || 'Kolkata Bus Stand, Imamganj, Gaya, Bihar';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Osama! I am browsing your website from my mobile and want to buy/inquire about a smartphone.`
  )}`;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`;

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_25px_rgba(0,0,0,0.6)] px-2 py-2 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1">
        {/* Home Button */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 text-slate-400 hover:text-emerald-400 active:scale-95 transition-all"
          aria-label="Scroll to top"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* Catalog Button */}
        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 text-slate-400 hover:text-emerald-400 active:scale-95 transition-all"
          aria-label="Browse Phone Stock"
        >
          <Search className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-tight">Phones</span>
        </button>

        {/* Highlighted WhatsApp Deal Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#1EBE5D] text-white font-black text-xs shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
          <span className="tracking-tight">WhatsApp</span>
        </a>

        {/* Direct Call Button */}
        <a
          href={`tel:${storePhone.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 text-slate-400 hover:text-emerald-400 active:scale-95 transition-all"
          aria-label="Call Store"
        >
          <Phone className="w-5 h-5 mb-0.5 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-tight">Call</span>
        </a>

        {/* Map / Directions */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 text-slate-400 hover:text-cyan-400 active:scale-95 transition-all"
          aria-label="Store Location Map"
        >
          <MapPin className="w-5 h-5 mb-0.5 text-rose-400" />
          <span className="text-[10px] font-bold tracking-tight">Shop</span>
        </a>
      </div>
    </div>
  );
}
