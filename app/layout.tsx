import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Second-Hand Mobile Hub | Certified Refurbished & Used Smartphones',
  description:
    'Browse 100% verified, inspected, second-hand smartphones with battery health check, original accessories, and real-time prices. Chat on WhatsApp for direct purchase.',
  keywords: [
    'second hand mobile',
    'used phones',
    'refurbished iphone',
    'samsung galaxy used',
    'oneplus used phone',
    'cheap second hand smartphones',
    'buy used phone on whatsapp',
  ],
  openGraph: {
    title: 'Second-Hand Mobile Hub | Quality Refurbished Smartphones',
    description:
      'Buy certified used smartphones with genuine battery health and 7-day warranty. Instant WhatsApp deal.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
