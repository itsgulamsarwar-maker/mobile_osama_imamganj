import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getSiteSettings } from '@/lib/sanity.client';

export const metadata: Metadata = {
  title: 'SECOND HAND MOBILE HUB IMAMGANJ | Certified Refurbished & Used Smartphones',
  description:
    'Kolkata bus stand Imamganj (Gaya, Bihar). 100% verified, inspected, second-hand smartphones with battery health check, original accessories, and real-time prices.',
  keywords: [
    'second hand mobile imamganj',
    'used phones gaya bihar',
    'refurbished iphone bihar',
    'second hand mobile hub',
    'samsung galaxy used imamganj',
    'buy used phone on whatsapp',
  ],
  openGraph: {
    title: 'SECOND HAND MOBILE HUB IMAMGANJ | Quality Refurbished Smartphones',
    description:
      'Buy certified used smartphones with genuine battery health and 7-day warranty in Imamganj, Gaya. Instant WhatsApp deal.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <FloatingWhatsApp
          whatsappNumber={settings.whatsappNumber}
          instagramUrl={settings.instagramUrl}
        />
      </body>
    </html>
  );
}
