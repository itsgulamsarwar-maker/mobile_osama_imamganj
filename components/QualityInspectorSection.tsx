import React from 'react';
import {
  ShieldCheck,
  Battery,
  Smartphone,
  Camera,
  Cpu,
  CheckCircle2,
  Video,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface QualityInspectorSectionProps {
  whatsappNumber?: string;
}

export default function QualityInspectorSection({
  whatsappNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '919102609396',
}: QualityInspectorSectionProps) {
  const videoInspectUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi! I want to request a live WhatsApp video call to inspect the phone before making a purchase.'
  )}`;

  const inspectionPillars = [
    {
      icon: Battery,
      title: 'Battery & Power Diagnostics',
      points: [
        'Real battery health & cycle count verified',
        'Fast charging speed & port connection tested',
        'Zero overheating or sudden battery drops',
      ],
      tag: 'Verified Capacity',
    },
    {
      icon: Smartphone,
      title: 'Screen & Touch Calibration',
      points: [
        '10-point multi-touch response with zero ghost touches',
        'TrueTone & ambient light sensors active',
        'Zero dead pixels, burn-in, or display flickering',
      ],
      tag: 'OEM Tested',
    },
    {
      icon: Camera,
      title: 'Optics & Biometrics Test',
      points: [
        'All camera lenses (Main, Ultra-wide, Telephoto) tested',
        'Optical Image Stabilization (OIS) & autofocus certified',
        'Face ID / In-Display Fingerprint sensor 100% working',
      ],
      tag: 'Crystal Clear',
    },
    {
      icon: Cpu,
      title: 'Hardware & IMEI Certification',
      points: [
        '100% Clean IMEI verified with zero police/network blocks',
        'All 5G/4G bands, Wi-Fi 6 & Bluetooth tested',
        'Liquid contact indicators checked — zero water damage',
      ],
      tag: 'Clean IMEI',
    },
  ];

  return (
    <div className="my-16 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Transparency & Trust Guarantee</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          How We Inspect Every Smartphone: <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Our 32-Point Quality Certification
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Unlike ordinary marketplaces, we personally test every single hardware component before listing.
          No surprises, no hidden defects.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {inspectionPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow-emerald group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-300">
                  {pillar.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                {pillar.title}
              </h3>
              <ul className="space-y-2">
                {pillar.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Video Call Inspection Callout */}
      <div className="bg-gradient-to-r from-emerald-900/30 via-slate-900 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base">
              Want to see the phone live before paying?
            </h4>
            <p className="text-xs text-slate-400">
              Request a live 2-minute WhatsApp video call with our counter staff to inspect screen, camera, and body.
            </p>
          </div>
        </div>

        <a
          href={videoInspectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105"
        >
          <span>Request Video Call</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
