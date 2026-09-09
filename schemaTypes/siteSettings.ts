import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Store Settings (Name, Logo, Address, Offers)',
  type: 'document',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      description: 'e.g., SECOND HAND MOBILE HUB IMAMGANJ',
      initialValue: 'SECOND HAND MOBILE HUB IMAMGANJ',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'storeTagline',
      title: 'Store Tagline / Subtitle',
      type: 'string',
      description: 'e.g., Certified 2nd Hand Smartphones • Gaya, Bihar',
      initialValue: 'Certified 2nd Hand Smartphones • Gaya, Bihar',
    }),
    defineField({
      name: 'logo',
      title: 'Store Logo Image',
      type: 'image',
      description: 'Upload your shop logo (optional)',
      options: {
        hotspot: true,
      },
    }),

    // --- URGENT SELLING / DISCOUNT PROMO BANNER ---
    defineField({
      name: 'showPromoBanner',
      title: 'Show Urgent Selling / Special Offer Banner?',
      type: 'boolean',
      description: 'Toggle ON when a discount, urgent sale, or festival offer is active',
      initialValue: true,
    }),
    defineField({
      name: 'promoTag',
      title: 'Promo Badge Tag',
      type: 'string',
      description: 'e.g., 🔥 URGENT SELLING OFFER or ⚡ FLASH DISCOUNT',
      initialValue: '🔥 URGENT SELLING OFFER',
    }),
    defineField({
      name: 'promoTitle',
      title: 'Promo Offer Headline',
      type: 'string',
      description: 'e.g., Flat ₹2,000 Extra Off on all iPhones & Galaxy S23 this week!',
      initialValue: 'Flat ₹2,000 Extra Off on all 5G Phones This Week!',
    }),
    defineField({
      name: 'promoDescription',
      title: 'Promo Offer Description',
      type: 'text',
      rows: 2,
      description: 'e.g., Free 20W Fast Charger + Original Back Cover included with every phone. First come, first served at Imamganj counter.',
      initialValue:
        'Free 20W Fast Charger + Original Back Cover with every purchase. Limited stock available at Kolkata Bus Stand, Imamganj counter.',
    }),
    defineField({
      name: 'promoButtonText',
      title: 'Promo WhatsApp Button Text',
      type: 'string',
      initialValue: 'Claim Offer on WhatsApp',
    }),

    // --- CONTACT & DETAILS ---
    defineField({
      name: 'phone',
      title: 'Calling Phone Number',
      type: 'string',
      initialValue: '+91 9102609396',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number (for direct buy links)',
      type: 'string',
      description: 'Without spaces or plus sign (e.g., 919102609396)',
      initialValue: '919102609396',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Shop Physical Address',
      type: 'string',
      initialValue: 'Kolkata Bus Stand, Imamganj, Gaya, Bihar',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Profile URL',
      type: 'url',
      initialValue: 'https://www.instagram.com/second_hand_mobile_hub1',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      initialValue: '@second_hand_mobile_hub1',
    }),
    defineField({
      name: 'announcement',
      title: 'Top Bar Announcement Notice',
      type: 'string',
      initialValue: 'Imamganj Retail Counter Open • 32-Point Quality Inspected • 7-Day Testing Guarantee',
    }),
    defineField({
      name: 'openingHours',
      title: 'Store Timings',
      type: 'string',
      initialValue: 'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 7:00 PM',
    }),
  ],
  preview: {
    select: {
      title: 'storeName',
      subtitle: 'address',
      media: 'logo',
    },
  },
});
