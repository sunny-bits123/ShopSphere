const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const uploadImage = async (filePath, folder = 'shopsphere') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: false,
  });
  return { url: result.secure_url, public_id: result.public_id };
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, uploadImage, deleteImage };
