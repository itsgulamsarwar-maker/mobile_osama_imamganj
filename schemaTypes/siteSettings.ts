import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Store Settings (Name, Logo, Address, Contact)',
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
      description: 'Upload your shop logo (optional - uses default modern icon if empty)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'phone',
      title: 'Calling Phone Number',
      type: 'string',
      description: 'e.g., +91 9102609396',
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
      description: 'e.g., Kolkata Bus Stand, Imamganj, Gaya, Bihar',
      initialValue: 'Kolkata Bus Stand, Imamganj, Gaya, Bihar',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Profile URL',
      type: 'url',
      description: 'e.g., https://www.instagram.com/second_hand_mobile_hub1',
      initialValue: 'https://www.instagram.com/second_hand_mobile_hub1',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'e.g., @second_hand_mobile_hub1',
      initialValue: '@second_hand_mobile_hub1',
    }),
    defineField({
      name: 'announcement',
      title: 'Top Bar Announcement Notice',
      type: 'string',
      description: 'Text shown at the very top of the website',
      initialValue: 'Imamganj Retail Counter Open • 32-Point Quality Inspected • 7-Day Testing Guarantee',
    }),
    defineField({
      name: 'openingHours',
      title: 'Store Timings',
      type: 'string',
      description: 'e.g., Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 7:00 PM',
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
