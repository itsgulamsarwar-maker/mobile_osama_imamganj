import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nswcuccj';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-03-01';

// useCdn: false ensures instant real-time reflection of price changes, stock, and store details
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export interface MobileItem {
  _id: string;
  title: string;
  brand: 'Apple' | 'Samsung' | 'OnePlus' | 'Xiaomi' | 'Vivo' | 'Oppo' | 'Realme' | 'Google' | 'Other';
  price: number;
  originalPrice?: number;
  variant: string;
  condition: 'Like New (10/10)' | 'Good' | 'Fair';
  batteryHealth?: string;
  includes?: string[];
  images?: SanityImage[] | string[];
  isSold?: boolean;
  description?: string;
  _createdAt?: string;
}

export interface SiteSettings {
  _id?: string;
  storeName: string;
  storeTagline?: string;
  logo?: SanityImage;
  phone: string;
  whatsappNumber: string;
  address: string;
  instagramUrl?: string;
  instagramHandle?: string;
  announcement?: string;
  openingHours?: string;
}

export const defaultSiteSettings: SiteSettings = {
  storeName: 'SECOND HAND MOBILE HUB IMAMGANJ',
  storeTagline: 'Certified 2nd Hand Smartphones • Gaya, Bihar',
  phone: '+91 9102609396',
  whatsappNumber: '919102609396',
  address: 'Kolkata Bus Stand, Imamganj, Gaya, Bihar',
  instagramUrl: 'https://www.instagram.com/second_hand_mobile_hub1',
  instagramHandle: '@second_hand_mobile_hub1',
  announcement:
    'Imamganj Retail Counter Open • 32-Point Quality Inspected • 7-Day Testing Guarantee',
  openingHours:
    'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 7:00 PM',
};

export const mobilesQuery = `*[_type == "mobile"] | order(isSold asc, _createdAt desc) {
  _id,
  title,
  brand,
  price,
  originalPrice,
  variant,
  condition,
  batteryHealth,
  includes,
  images,
  isSold,
  description,
  _createdAt
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  storeName,
  storeTagline,
  logo,
  phone,
  whatsappNumber,
  address,
  instagramUrl,
  instagramHandle,
  announcement,
  openingHours
}`;

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await client.fetch<SiteSettings>(siteSettingsQuery);
    if (data && data.storeName) {
      return { ...defaultSiteSettings, ...data };
    }
  } catch (err) {
    console.warn('Could not fetch siteSettings from Sanity, using defaults:', err);
  }
  return defaultSiteSettings;
}
