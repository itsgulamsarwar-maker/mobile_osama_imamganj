'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import MobileBottomBar from '@/components/MobileBottomBar';
import { SiteSettings } from '@/lib/sanity.client';

interface StorefrontLayoutProps {
  children: React.ReactNode;
  settings: SiteSettings;
}

export default function StorefrontLayout({ children, settings }: StorefrontLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If on admin routes, do not render storefront header, footer, floating WhatsApp, or bottom bar
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        instagramUrl={settings.instagramUrl}
        storeName={settings.storeName}
      />
      <MobileBottomBar settings={settings} />
    </>
  );
}
