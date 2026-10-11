/**
 * Image processing utilities for client-side scaling and format normalization.
 */

export interface ProcessedImageData {
  dataUrl: string;
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  originalSizeBytes: number;
}

/**
 * Resizes an image file if it exceeds maxDimension (default 1600px)
 * and returns normalized data URL and base64.
 */
export async function processImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.88
): Promise<ProcessedImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file from disk.'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for processing. The file may be corrupted.'));

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate scaling
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize canvas context for image processing.'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Normalize output mimeType (preserve PNG if transparent, else JPEG)
        const targetMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(targetMime, quality);
        const base64 = dataUrl.split(',')[1];

        resolve({
          dataUrl,
          base64,
          mimeType: targetMime,
          width,
          height,
          originalSizeBytes: file.size,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
