# Second-Hand Mobile Hub (Imamganj)

Official web application for **Second Hand Mobile Hub Imamganj** (Kolkata Bus Stand, Imamganj, Gaya, Bihar). Built with **Next.js 14+ (App Router, TypeScript)**, **Tailwind CSS**, and **Sanity.io Headless CMS Studio**.

---

## 📱 Features

- **Integrated Sanity Studio (`/admin`)**: Real-time phone inventory management, photo uploads (HD gallery), condition rating, battery health, and instant price updates without caching delay (`useCdn: false`).
- **Direct WhatsApp Ordering**: "Chat on WhatsApp to Buy" CTA pre-fills phone model, RAM/Storage variant, battery health, and price directly to `+91 9102609396`.
- **Sold Out System**: Real-time "Sold Out" overlay badge with "Notify Me on Restock" WhatsApp trigger.
- **32-Point Quality Certification**: Visual diagnostics breakdown (Battery diagnostics, screen TrueTone, pro optics, clean IMEI) and live WhatsApp video call request.
- **Multi-Filter & Search**: Filter by Brand (Apple, Samsung, OnePlus, Xiaomi, etc.), Budget tiers (Under ₹35k, ₹35k-₹50k, Above ₹50k), and quick search tags.
- **HD Lightbox Gallery**: Full-screen modal with multi-angle photos and thumbnail carousel.
- **Instagram Integration**: Direct links to `@second_hand_mobile_hub1` for daily unboxing reels and newly arrived stock.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=nswcuccj
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_STORE_WHATSAPP_NUMBER=919102609396
NEXT_PUBLIC_STORE_INSTAGRAM_URL=https://www.instagram.com/second_hand_mobile_hub1
NEXT_PUBLIC_STORE_INSTAGRAM_HANDLE=second_hand_mobile_hub1
NEXT_PUBLIC_STORE_ADDRESS=Kolkata Bus Stand, Imamganj, Gaya, Bihar
```

### 3. Run Locally
```bash
pnpm dev
```
- Storefront: `http://localhost:3000`
- Sanity Admin Studio: `http://localhost:3000/admin`

---

## 🏬 Retail Store Information
- **Store Name**: SECOND HAND MOBILE HUB IMAMGANJ
- **Location**: Kolkata Bus Stand, Imamganj, Gaya, Bihar
- **Contact**: +91 9102609396
- **Instagram**: [@second_hand_mobile_hub1](https://www.instagram.com/second_hand_mobile_hub1)
