'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Video, RefreshCw, Zap, Instagram } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919102609396';
  const instagramUrl =
    process.env.NEXT_PUBLIC_STORE_INSTAGRAM_URL ||
    'https://www.instagram.com/second_hand_mobile_hub1';

  const quickPrompts = [
    {
      icon: Video,
      title: 'Video Call Inspection',
      desc: 'Inspect phone on live video',
      msg: 'Hi! I would like to request a live video call to inspect a second-hand phone at Imamganj counter.',
    },
    {
      icon: RefreshCw,
      title: 'Exchange Old Phone',
      desc: 'Get instant trade-in quote',
      msg: 'Hi! I want to exchange my old smartphone. What price will I get?',
    },
    {
      icon: Zap,
      title: "Today's Best Deal",
      desc: 'Check newly arrived phones',
      msg: "Hi! Can you share today's newly arrived second-hand smartphones and prices?",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Mobile Hub Imamganj</h4>
                <p className="text-[11px] text-emerald-100 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 mr-1.5 animate-pulse" />
                  +91 9102609396 • Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-4 space-y-2.5 bg-slate-950/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select what you need:
            </p>
            {quickPrompts.map((item, idx) => {
              const Icon = item.icon;
              const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(item.msg)}`;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-emerald-300">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </div>
                </a>
              );
            })}

            {/* Instagram Profile Quick Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/30 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-pink-300">Instagram Reels & Unboxing</h5>
                <p className="text-[10px] text-slate-400">@second_hand_mobile_hub1</p>
              </div>
            </a>

            {/* Direct General WhatsApp Chat */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hi! I want to inquire about second-hand smartphones available at Second Hand Mobile Hub Imamganj.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              <span>Direct Chat: +91 9102609396</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ring-4 ring-emerald-500/30 group"
        aria-label="Toggle WhatsApp Assistance"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-slate-900"></span>
        </span>
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-transparent" />
      </button>
    </div>
  );
}
