import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Battery,
  MapPin,
  Phone,
  MessageCircle,
  Video,
  Instagram,
} from 'lucide-react';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919102609396';
  const instagramUrl =
    process.env.NEXT_PUBLIC_STORE_INSTAGRAM_URL ||
    'https://www.instagram.com/second_hand_mobile_hub1';
  const storeAddress =
    process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Kolkata Bus Stand, Imamganj, Gaya, Bihar';

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-24 border-t border-slate-800/80 relative">
      {/* Guarantees Bar */}
      <div className="border-b border-slate-800/80 py-12 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">32-Point Quality Inspected</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Display touch, TrueTone, camera OIS, microphones & motherboards 100% verified.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Battery className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Genuine Battery Health</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Accurate battery percentage listed on every mobile. Zero fake cell meters.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">7-Day Testing Warranty</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Hassle-free 7-day replacement guarantee if any hardware defect is discovered.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">WhatsApp Video Inspection</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Request a live video call with counter staff to see the phone before paying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center space-x-2.5 text-white font-black text-xl mb-3">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              <span>
                SECOND HAND MOBILE HUB <span className="text-emerald-400">IMAMGANJ</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm mb-5">
              Imamganj Gaya ka sabse bharosemand second-hand aur refurbished smartphones showroom.
              100% genuine IMEI, original bill & box, aur verified hardware testing.
            </p>

            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-xs text-emerald-400 font-semibold">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{storeAddress}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">Connect With Us</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 text-pink-300 hover:text-white transition-all font-semibold"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram: @second_hand_mobile_hub1</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:text-white transition-all font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: +91 9102609396</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors inline-block pt-1">
                  Shop Owner Admin Panel (/admin)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">Retail Counter Timings</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Monday - Saturday: 10:00 AM - 9:00 PM<br />
              Sunday: 11:00 AM - 7:00 PM<br />
              <span className="text-emerald-400 font-semibold">Counter: Kolkata Bus Stand, Imamganj</span>
            </p>
            <div className="pt-1">
              <a
                href={`tel:+${whatsappNumber}`}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500 text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Call: +91 9102609396</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Second Hand Mobile Hub Imamganj (Gaya, Bihar). All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
