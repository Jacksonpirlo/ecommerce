import cloudinary from '@/lib/claudinary';

export async function uploadImage(filePath: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'e-commerce-aurinegro',
    });
    return result;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
}