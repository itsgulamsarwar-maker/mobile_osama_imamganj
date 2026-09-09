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
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Zap,
  ArrowDown,
  PhoneCall,
  Video,
  Award,
  Star,
  Instagram,
  MapPin,
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
    `Hi! I am browsing ${settings.storeName} and looking for a phone recommendation.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill with Location */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/50">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{settings.address}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] sm:leading-none">
            Flagship Smartphones.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Honest Prices.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white">{settings.storeName}</strong>.
            Every phone undergoes our certified 32-point inspection with genuine battery health,
            authentic box & accessories, and a 7-day testing warranty.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#catalog-section"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <span>Explore Verified Stock</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-amber-600/20 hover:from-pink-600/30 hover:to-purple-600/30 border border-pink-500/40 text-pink-300 hover:text-white font-bold text-sm transition-all"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram ({settings.instagramHandle || '@second_hand_mobile_hub1'})</span>
            </a>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-sm transition-all"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {settings.phone}</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-white">500+</span>
              <span className="text-xs text-slate-400 font-medium">Phones Sold in Bihar</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">32-Point</span>
              <span className="text-xs text-slate-400 font-medium">Certified Inspection</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-cyan-400">7 Days</span>
              <span className="text-xs text-slate-400 font-medium">Testing Warranty</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl sm:text-3xl font-black text-pink-400 flex items-center justify-center">
                1,200+
              </span>
              <span className="text-xs text-slate-400 font-medium">Instagram Followers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <CatalogView initialMobiles={mobiles} />

        {/* 32-Point Quality Inspector Breakdown */}
        <QualityInspectorSection />

        {/* Instagram Follow Callout Banner */}
        <div className="my-12 bg-gradient-to-r from-pink-950/40 via-slate-900 to-purple-950/40 border border-pink-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/20">
              <Instagram className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Follow Us on Instagram for Daily Unboxing & Deals!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Watch real testing videos and new stock arrivals on{' '}
                <strong className="text-pink-400">
                  {settings.instagramHandle || '@second_hand_mobile_hub1'}
                </strong>{' '}
                (1,228+ Followers).
              </p>
            </div>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 transition-all transform hover:scale-105"
          >
            <Instagram className="w-4 h-4" />
            <span>Open Instagram Profile</span>
          </a>
        </div>

        {/* Customer Testimonials & Savings */}
        <TestimonialsSection />

        {/* FAQ Accordion */}
        <FAQSection />
      </section>
    </div>
  );
}
