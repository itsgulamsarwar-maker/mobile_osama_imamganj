import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nswcuccj';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-03-01';

// useCdn: false ensures instant real-time reflection of price changes & stock updates
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
