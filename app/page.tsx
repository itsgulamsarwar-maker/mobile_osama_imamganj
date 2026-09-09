import React from 'react';
import {
  client,
  mobilesQuery,
  MobileItem,
  getSiteSettings,
  SiteSettings,
} from '@/lib/sanity.client';
import { mockMobiles } from '@/lib/mockData';
import CatalogView from '@/components/CatalogView';
import QualityInspectorSection from '@/components/QualityInspectorSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import UrgentOfferBanner from '@/components/UrgentOfferBanner';
import {
  ShieldCheck,
  Zap,
  ArrowDown,
  PhoneCall,
  Video,
  Instagram,
  MapPin,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

async function getMobiles(): Promise<MobileItem[]> {
  try {
    const sanityData = await client.fetch<MobileItem[]>(mobilesQuery);
    if (sanityData && sanityData.length > 0) {
      return sanityData;
    }
  } catch (error) {
    console.warn('Could not fetch from Sanity, falling back to mock catalog:', error);
  }
  return mockMobiles;
}

export default async function HomePage() {
  const [mobiles, settings] = await Promise.all([getMobiles(), getSiteSettings()]);

  const whatsappNumber = settings.whatsappNumber || '919102609396';
  const instagramUrl =
    settings.instagramUrl || 'https://www.instagram.com/second_hand_mobile_hub1';

  const generalWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Osama! I am browsing your website and looking for a phone recommendation.`
  )}`;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-5 pb-6 sm:pt-12 sm:pb-12 border-b border-white/[0.05]">
        {/* Subtle Ambient Light Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-emerald-500/[0.07] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-0 w-72 h-72 bg-cyan-500/[0.06] rounded-full blur-[90px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Location Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{settings.address}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Flagship Smartphones.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Honest Prices.
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white font-bold">{settings.storeName}</strong>.
            Verified battery health, original accessories, and a 7-day testing warranty on every device.
          </p>

          {/* Quick Actions Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <a
              href="#catalog-section"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
            >
              <span>Explore Stock</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Video className="w-4 h-4 fill-white text-transparent" />
              <span>Video Inspection</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 border border-white/[0.08] font-bold text-xs sm:text-sm transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call: {settings.phone}</span>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                settings.address || 'Kolkata Bus Stand, Imamganj, Gaya, Bihar'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 border border-white/[0.08] font-bold text-xs sm:text-sm transition-all active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Directions</span>
            </a>
          </div>

          {/* Micro Stats Row */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="block text-lg sm:text-2xl font-black text-white">500+</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Phones Sold in Bihar</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="block text-lg sm:text-2xl font-black text-emerald-400">32-Point</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Inspection Check</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="block text-lg sm:text-2xl font-black text-cyan-400">7 Days</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Testing Guarantee</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="block text-lg sm:text-2xl font-black text-pink-400">1,200+</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Instagram Family</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8">
        {/* Urgent Promo Offer */}
        <UrgentOfferBanner settings={settings} />

        {/* Catalog Section */}
        <CatalogView initialMobiles={mobiles} whatsappNumber={whatsappNumber} />

        {/* 32-Point Quality Inspector Breakdown */}
        <QualityInspectorSection whatsappNumber={whatsappNumber} />

        {/* Instagram Follow Callout Banner */}
        <div className="my-8 bg-gradient-to-r from-pink-950/20 via-white/[0.02] to-purple-950/20 border border-pink-500/25 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/20">
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Follow Us on Instagram for Daily Unboxing
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Watch real testing videos on{' '}
                <strong className="text-pink-400">
                  {settings.instagramHandle || '@second_hand_mobile_hub1'}
                </strong>
              </p>
            </div>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-pink-600/20"
          >
            <Instagram className="w-4 h-4" />
            <span>Open Instagram Profile</span>
          </a>
        </div>

        {/* Customer Testimonials & Savings */}
        <TestimonialsSection />

        {/* FAQ Accordion */}
        <FAQSection whatsappNumber={whatsappNumber} />
      </div>
    </div>
  );
}
