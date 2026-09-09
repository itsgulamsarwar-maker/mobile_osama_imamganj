'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919876543210';

  const faqs = [
    {
      q: 'Are all second-hand smartphones original and clean IMEI verified?',
      a: 'Yes, 100%. Every single phone goes through our 32-point inspection check. We verify the IMEI number across national databases to guarantee it is not blacklisted, financed, or reported. All motherboard and display components are tested for authenticity.',
    },
    {
      q: 'What is covered under the 7-Day Testing Warranty?',
      a: 'If you find any technical hardware malfunction (camera, speaker, network, display touch, or battery defect) within 7 days of purchase, we offer immediate replacement or a full refund without questions.',
    },
    {
      q: 'Can I see the phone on a WhatsApp video call before purchasing?',
      a: 'Absolutely! Just click "Chat on WhatsApp to Buy" or message us directly. Our retail counter staff will give you a live 2-minute video call showing the phone from all angles, display brightness, camera zoom, and physical condition.',
    },
    {
      q: 'How does delivery and store pickup work?',
      a: 'You have two easy choices: 1) Visit our retail counter in person for hands-on inspection and instant pickup. 2) Order via WhatsApp for same-day dispatch with secure tamper-proof packaging and tracking.',
    },
    {
      q: 'Can I exchange or sell my old smartphone here?',
      a: 'Yes! Send us photos and details of your current smartphone on WhatsApp. We provide instant valuation and deduct the exchange price directly from your upgrade.',
    },
  ];

  return (
    <div className="my-16 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Everything you need to know about buying certified second-hand phones safely.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ml-4 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Footer */}
      <div className="mt-8 text-center bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs sm:text-sm text-slate-400">
          Have a different question or looking for a specific model?
        </span>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            'Hi, I have a quick question regarding second-hand phones in your store.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
