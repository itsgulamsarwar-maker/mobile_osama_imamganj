/**
 * Client-side high performance image compression utility.
 * Compresses heavy mobile camera photos (5MB - 20MB) down to ~100KB - 250KB WebP/JPEG
 * before uploading to the server.
 */

export interface CompressionResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP for superior compression, fallback to JPEG
        const outputMimeType = 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'));
              return;
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanFileName, {
              type: outputMimeType,
              lastModified: Date.now(),
            });

            const previewUrl = URL.createObjectURL(blob);
            const originalSize = file.size;
            const compressedSize = blob.size;
            const reductionPercentage = Math.round(
              ((originalSize - compressedSize) / originalSize) * 100
            );

            resolve({
              file: compressedFile,
              previewUrl,
              originalSize,
              compressedSize,
              reductionPercentage: Math.max(0, reductionPercentage),
              width,
              height,
            });
          },
          outputMimeType,
          quality
        );
      };

      img.onerror = (err) => reject(new Error('Failed to load image for compression'));
    };

    reader.onerror = (err) => reject(new Error('Failed to read file'));
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
