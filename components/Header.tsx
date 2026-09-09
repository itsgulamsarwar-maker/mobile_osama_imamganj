import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Lock, MessageCircle, Phone, MapPin, Instagram } from 'lucide-react';
import { SiteSettings, defaultSiteSettings } from '@/lib/sanity.client';
import { getImageSrc } from '@/lib/sanity.image';

interface HeaderProps {
  settings?: SiteSettings;
}

export default function Header({ settings = defaultSiteSettings }: HeaderProps) {
  const whatsappNumber = settings.whatsappNumber || '919102609396';
  const instagramUrl =
    settings.instagramUrl || 'https://www.instagram.com/second_hand_mobile_hub1';
  const storeAddress = settings.address || 'Kolkata Bus Stand, Imamganj, Gaya, Bihar';
  const storePhone = settings.phone || '+91 9102609396';
  const announcement =
    settings.announcement ||
    'Imamganj Retail Counter Open • 32-Point Quality Inspected • 7-Day Testing Guarantee';

  const logoSrc = settings.logo ? getImageSrc(settings.logo) : null;

  const directSupportUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello! I am contacting ${settings.storeName} regarding available smartphones.`
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/80 border-b border-emerald-900/30 text-slate-300 text-xs py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 mx-auto sm:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">{announcement}</span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center text-slate-300">
              <MapPin className="w-3 h-3 mr-1 text-emerald-400" />
              {storeAddress}
            </span>
            <span>•</span>
            <a
              href={`tel:${storePhone.replace(/\s+/g, '')}`}
              className="flex items-center hover:text-emerald-400 transition-colors font-semibold"
            >
              <Phone className="w-3 h-3 mr-1 text-emerald-400" />
              {storePhone}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Store Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 overflow-hidden">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={settings.storeName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Smartphone className="w-6 h-6 group-hover:rotate-6 transition-transform" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-white tracking-tight line-clamp-1">
                  {settings.storeName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {settings.storeTagline || 'Certified 2nd Hand Smartphones • Gaya, Bihar'}
              </p>
            </div>
          </Link>

          {/* Right Action Links */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Instagram Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold text-pink-300 hover:text-white bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/30 transition-all shadow-sm"
              title={`Follow on Instagram ${settings.instagramHandle || ''}`}
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Instagram</span>
            </a>

            {/* Sanity Studio Link for Shop Owner */}
            <Link
              href="/admin"
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-emerald-500/50"
              title="Shop Owner Admin Panel"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            {/* Direct Support WhatsApp */}
            <a
              href={directSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
