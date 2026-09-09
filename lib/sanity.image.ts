import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source) {
    return {
      url: () => '/placeholder-phone.png',
      width: () => ({ url: () => '/placeholder-phone.png' }),
      height: () => ({ url: () => '/placeholder-phone.png' }),
    };
  }

  // If source is already a direct string URL (e.g. mock/external preview image)
  if (typeof source === 'string') {
    return {
      url: () => source,
      width: () => ({ url: () => source }),
      height: () => ({ url: () => source }),
    };
  }

  // If source has an asset ref or direct url
  if (source.asset && typeof source.asset === 'string' && source.asset.startsWith('http')) {
    return {
      url: () => source.asset,
      width: () => ({ url: () => source.asset }),
      height: () => ({ url: () => source.asset }),
    };
  }

  return builder.image(source);
}

export function getImageSrc(image: any): string {
  if (!image) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80';
  if (typeof image === 'string') return image;
  try {
    const built = builder.image(image);
    return built.url() || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80';
  } catch {
    return typeof image.asset?.url === 'string' ? image.asset.url : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80';
  }
}
