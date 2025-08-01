import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("error >>", error);
    fs.unlinkSync(localFilePath);
  }
};

export { uploadToCloudinary };
