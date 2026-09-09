import { defineType, defineField } from 'sanity';

export const mobile = defineType({
  name: 'mobile',
  title: 'Mobile Phone',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Phone Model / Title',
      type: 'string',
      description: 'e.g., iPhone 13 Pro Max or Samsung Galaxy S23 Ultra',
      validation: (Rule) => Rule.required().error('Title is required'),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      options: {
        list: [
          { title: 'Apple', value: 'Apple' },
          { title: 'Samsung', value: 'Samsung' },
          { title: 'OnePlus', value: 'OnePlus' },
          { title: 'Xiaomi', value: 'Xiaomi' },
          { title: 'Vivo', value: 'Vivo' },
          { title: 'Oppo', value: 'Oppo' },
          { title: 'Realme', value: 'Realme' },
          { title: 'Google', value: 'Google' },
          { title: 'Other', value: 'Other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().error('Brand is required'),
    }),
    defineField({
      name: 'price',
      title: 'Selling Price (₹)',
      type: 'number',
      description: 'Actual selling price in INR',
      validation: (Rule) => Rule.required().positive().error('Valid selling price is required'),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original / MRP Price (₹)',
      type: 'number',
      description: 'Original launch price or MRP for showing discount (optional)',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'variant',
      title: 'Storage & RAM Variant',
      type: 'string',
      description: 'e.g., 128GB / 6GB RAM or 256GB / 8GB RAM',
      validation: (Rule) => Rule.required().error('Variant is required'),
    }),
    defineField({
      name: 'condition',
      title: 'Physical Condition',
      type: 'string',
      options: {
        list: [
          { title: 'Like New (10/10)', value: 'Like New (10/10)' },
          { title: 'Good', value: 'Good' },
          { title: 'Fair', value: 'Fair' },
        ],
        layout: 'radio',
      },
      initialValue: 'Like New (10/10)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'batteryHealth',
      title: 'Battery Health',
      type: 'string',
      description: 'e.g., 85%, 92%, or Replaced New Battery',
      initialValue: '85%',
    }),
    defineField({
      name: 'includes',
      title: 'Included Accessories & Documents',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Box', value: 'Box' },
          { title: 'Original Charger', value: 'Original Charger' },
          { title: 'Bill / Invoice', value: 'Bill' },
          { title: 'Charging Cable', value: 'Cable' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Upload HD pictures (Front, Back, Screen, Accessories). First image is primary thumbnail.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'e.g., Front view showing scratchless display',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('At least 1 product image is required'),
    }),
    defineField({
      name: 'isSold',
      title: 'Sold Out Status',
      type: 'boolean',
      description: 'Toggle on when this item has been sold to automatically mark as Sold Out on the website',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Detailed Description / Notes',
      type: 'text',
      rows: 4,
      description: 'Refurbishment notes, warranty status, minor cosmetic marks if any',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      variant: 'variant',
      media: 'images.0',
      isSold: 'isSold',
    },
    prepare({ title, subtitle, variant, media, isSold }) {
      return {
        title: `${title} ${isSold ? '❌ [SOLD OUT]' : '✅ [IN STOCK]'}`,
        subtitle: `₹${subtitle ? subtitle.toLocaleString('en-IN') : 'N/A'} • ${variant || ''}`,
        media,
      };
    },
  },
});
