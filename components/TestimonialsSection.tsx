import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Rahul Sharma',
      city: 'Delhi NCR',
      phoneBought: 'iPhone 14 Pro (128GB)',
      savedAmount: '₹60,900',
      rating: 5,
      date: '2 days ago',
      review:
        'Was hesitant to buy second-hand online, but the counter staff showed me the phone on WhatsApp video call first. Battery was exactly 92% as promised with original box. Saved over 60k!',
    },
    {
      name: 'Ankit Verma',
      city: 'Bengaluru',
      phoneBought: 'Samsung Galaxy S23 Ultra',
      savedAmount: '₹60,499',
      rating: 5,
      date: '1 week ago',
      review:
        'S-Pen and 200MP camera work flawlessly. 7-day testing warranty gave me complete peace of mind. Delivered securely in 24 hours with bubble wrap and invoice.',
    },
    {
      name: 'Mohd. Faisal',
      city: 'Hyderabad',
      phoneBought: 'OnePlus 11 5G (16GB RAM)',
      savedAmount: '₹20,000',
      rating: 5,
      date: '2 weeks ago',
      review:
        'Original 100W SuperVOOC charger was included in the box! Charges to 100% in 25 minutes. Mint condition without a single scratch on the screen. Best place for refurbished phones.',
    },
  ];

  return (
    <div className="my-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
          <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>Real Customer Feedback</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Trusted by <span className="text-emerald-400">1,200+ Smart Buyers</span> Across India
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          See how much customers saved by choosing verified second-hand smartphones with our warranty.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-glow-emerald transition-all duration-300 relative"
          >
            <div>
              {/* Top rating and saved pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Saved {rev.savedAmount}
                </span>
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                "{rev.review}"
              </p>
            </div>

            {/* Buyer Profile Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center">
                  {rev.name}
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-1.5" />
                </h4>
                <p className="text-[11px] text-slate-400">
                  {rev.city} • <span className="text-emerald-400 font-medium">{rev.phoneBought}</span>
                </p>
              </div>
              <span className="text-[10px] text-slate-500">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
