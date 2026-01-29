const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Ukuran file maksimal 5MB");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "daily-hangout-spots");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Upload gagal");
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Gagal upload gambar: " + error.message);
  }
};

export const deleteImage = async (publicId) => {
  console.log("Delete image:", publicId, "(skipped - requires backend)");
};

export const getOptimizedUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  const { width = 800, quality = "auto", format = "auto" } = options;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformations = `w_${width},q_${quality},f_${format}`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export const getThumbnailUrl = (url) => {
  return getOptimizedUrl(url, {
    width: 200,
    quality: "auto",
    format: "auto",
  });
};

export const getCardImageUrl = (url) => {
  return getOptimizedUrl(url, {
    width: 400,
    quality: "auto",
    format: "auto",
  });
};

export const getDetailImageUrl = (url) => {
  return getOptimizedUrl(url, {
    width: 800,
    quality: "auto",
    format: "auto",
  });
};
