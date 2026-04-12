import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
};

/**
 * Optimizes an image file using browser-side compression.
 * @param file The image file to compress
 * @param options Optional compression settings
 * @returns A promise that resolves to the compressed File
 */
export async function optimizeImage(file: File, options: CompressionOptions = {}): Promise<File> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    console.log(`Optimizing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    const compressedFile = await imageCompression(file, mergedOptions);
    console.log(`Optimization complete: ${compressedFile.name} (${(compressedFile.size / 1024 / 1024).toFixed(2)} MB)`);
    return compressedFile;
  } catch (error) {
    console.error('Image optimization failed:', error);
    // Return original file if compression fails to avoid breaking the flow
    return file;
  }
}

/**
 * Optimizes an array of image files.
 * @param files Array of image files
 * @param options Optional compression settings
 * @returns A promise that resolves to an array of compressed Files
 */
export async function optimizeImages(files: File[], options: CompressionOptions = {}): Promise<File[]> {
  return Promise.all(files.map(file => optimizeImage(file, options)));
}
