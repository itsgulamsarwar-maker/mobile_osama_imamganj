import React from 'react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Md. Tariq Alam',
      city: 'Imamganj Main Market',
      phoneBought: 'iPhone 13 (128GB)',
      savedAmount: '₹31,900',
      rating: 5,
      date: 'Yesterday',
      review:
        'Kolkata Bus Stand counter pe jaakar phone physically check kiya. Display 100% original tha aur battery health 87% genuine mili. Bill aur box ke saath turant mil gaya. Imamganj me best deal!',
    },
    {
      name: 'Rahul Kumar',
      city: 'Station Road, Gaya',
      phoneBought: 'Samsung Galaxy S23 Ultra',
      savedAmount: '₹60,499',
      rating: 5,
      date: '3 days ago',
      review:
        'Pehle WhatsApp video call pe Osama bhaiya ne pura phone zoom karke dikhaya. S-Pen aur 200MP camera bilkul naya jaisa chal raha hai. 7-Day testing warranty ne pura bharosa diya.',
    },
    {
      name: 'Aman Singh',
      city: 'GT Road, Sherghati',
      phoneBought: 'OnePlus 11 5G (16GB RAM)',
      savedAmount: '₹20,000',
      rating: 5,
      date: '1 week ago',
      review:
        'Original 100W SuperVOOC charger box ke andar mila. Battery 25 minute me full charge hoti hai. Ek bhi scratch nahi hai screen pe. Bihar me used phone lene ke liye sabse best shop.',
    },
  ];

  return (
    <div className="my-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
          <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>Local Customer Trust • Gaya & Imamganj</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Trusted by <span className="text-emerald-400">1,200+ Smart Buyers</span> in Bihar
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Kolkata Bus Stand Imamganj counter se verified phones lene wale verified customers ke real reviews.
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
