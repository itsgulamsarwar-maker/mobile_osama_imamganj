'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Lock, MessageCircle, Phone, MapPin, Instagram, Sparkles } from 'lucide-react';
import { SiteSettings, defaultSiteSettings } from '@/lib/sanity.client';
import { getImageSrc } from '@/lib/sanity.image';

interface HeaderProps {
  settings?: SiteSettings;
}

export default function Header({ settings = defaultSiteSettings }: HeaderProps) {
  const whatsappNumber = settings.whatsappNumber || '919102609396';
  const instagramUrl =
    settings.instagramUrl || 'https://www.instagram.com/second_hand_mobile_hub1';
  const storePhone = settings.phone || '+91 9102609396';
  const storeAddress = settings.address || 'Kolkata Bus Stand, Imamganj, Gaya';
  const logoSrc = settings.logo ? getImageSrc(settings.logo) : null;

  const directSupportUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello! I am contacting ${settings.storeName || 'Osama Mobile'} regarding available smartphones.`
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-2xl border-b border-white/[0.07]">
      {/* Desktop-only subtle announcement bar */}
      <div className="hidden md:block bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border-b border-white/[0.05] py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium">
              {settings.announcement || 'Retail Counter Open @ Kolkata Bus Stand, Imamganj • 7-Day Testing Warranty'}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a
              href={`tel:${storePhone.replace(/\s+/g, '')}`}
              className="flex items-center text-slate-300 hover:text-emerald-400 font-semibold transition-colors"
            >
              <Phone className="w-3 h-3 mr-1 text-emerald-400" />
              {storePhone}
            </a>
            <span>•</span>
            <span className="flex items-center text-slate-400">
              <MapPin className="w-3 h-3 mr-1 text-cyan-400" />
              {storeAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Store Branding */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center text-emerald-400 overflow-hidden">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={settings.storeName || 'OSAMA MOBILE'}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-black text-white tracking-tight leading-tight truncate">
                  {settings.storeName || 'OSAMA MOBILE'}
                </span>
                <span className="hidden xs:inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate leading-tight mt-0.5">
                {settings.storeTagline || 'Imamganj • Second Hand Mobile Hub'}
              </p>
            </div>
          </Link>

          {/* Quick Actions Right Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Quick Call Icon Button */}
            <a
              href={`tel:${storePhone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] hover:bg-emerald-500/15 text-slate-300 hover:text-emerald-400 border border-white/[0.08] hover:border-emerald-500/30 transition-all active:scale-95"
              aria-label="Direct Call"
              title={`Call: ${storePhone}`}
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>

            {/* Instagram Icon Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] hover:bg-pink-500/15 text-slate-300 hover:text-pink-400 border border-white/[0.08] hover:border-pink-500/30 transition-all active:scale-95"
              aria-label="Instagram Profile"
              title="Follow on Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
            </a>

            {/* Admin Studio Link */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              title="Admin Panel"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </Link>

            {/* WhatsApp Deal Button */}
            <a
              href={directSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-extrabold bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
