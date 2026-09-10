'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck, Battery } from 'lucide-react';
import { MobileItem } from '@/lib/sanity.client';
import { getImageSrc } from '@/lib/sanity.image';

interface MobileGalleryModalProps {
  mobile: MobileItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  whatsappNumber?: string;
}

export default function MobileGalleryModal({
  mobile,
  isOpen,
  onClose,
  initialIndex = 0,
  whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919102609396',
}: MobileGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 45;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  const images = mobile?.images && mobile.images.length > 0 ? mobile.images : [];
  const totalImages = images.length;

  const handleNext = useCallback(() => {
    if (totalImages > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }
  }, [totalImages]);

  const handlePrev = useCallback(() => {
    if (totalImages > 0) {
      setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  }, [totalImages]);

  // Mobile touch swipe handling
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  // Keyboard navigation (ESC, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !mobile) return null;

  const currentImgSrc = getImageSrc(images[currentIndex]);
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm viewing the gallery of *${mobile.title} (${mobile.variant})* priced at *₹${mobile.price.toLocaleString('en-IN')}*. Is it still in stock?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:h-auto max-w-5xl bg-slate-900 border-0 sm:border border-slate-800 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 text-white">
          <div className="flex items-center space-x-3 truncate">
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-slate-100 truncate">
                {mobile.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {mobile.variant} • ₹{mobile.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {totalImages > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {currentIndex + 1} / {totalImages}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main image stage with touch swipe */}
        <div
          className="relative flex-1 min-h-[260px] sm:min-h-[450px] md:min-h-[520px] bg-black/60 flex items-center justify-center p-2 sm:p-4 select-none touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {totalImages > 0 ? (
            <div className="relative w-full h-full min-h-[260px] sm:min-h-[440px] flex items-center justify-center">
              <Image
                src={currentImgSrc}
                alt={`${mobile.title} - View ${currentIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1000px"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="text-slate-500 text-sm">No pictures available for this phone</div>
          )}

          {/* Sold Out badge overlay if applicable */}
          {mobile.isSold && (
            <div className="absolute top-4 left-4 bg-rose-600/90 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md shadow-lg tracking-wider border border-rose-400">
              Sold Out
            </div>
          )}

          {/* Prev button */}
          {totalImages > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all transform hover:scale-105 border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Next button */}
          {totalImages > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all transform hover:scale-105 border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Bottom thumbnail strip & footer CTA */}
        <div className="p-3 sm:px-4 sm:py-3 bg-slate-950/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Thumbnails */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1 scrollbar-thin w-full sm:w-auto">
            {images.map((img, idx) => {
              const src = getImageSrc(img);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumb ${idx + 1}`}
                    fill
                    loading="lazy"
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Quick Details & WhatsApp Buy */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400">
              <span className="flex items-center text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {mobile.condition}
              </span>
              {mobile.batteryHealth && (
                <span className="flex items-center text-slate-300">
                  <Battery className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  {mobile.batteryHealth}
                </span>
              )}
            </div>

            {mobile.isSold ? (
              <span className="w-full sm:w-auto text-center px-5 py-3 bg-slate-800 text-slate-500 rounded-xl font-bold text-xs sm:text-sm cursor-not-allowed border border-slate-700">
                Sold Out
              </span>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>Chat on WhatsApp to Buy (₹{mobile.price.toLocaleString('en-IN')})</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
