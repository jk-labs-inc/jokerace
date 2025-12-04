import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";

const IMGUR_API_ENDPOINT = "https://api.imgur.com/3/image";
const IMGUR_CLIENT_ID = import.meta.env.VITE_IMGUR_CLIENT_ID;

if (!IMGUR_CLIENT_ID) {
  console.error("Please set the VITE_IMGUR_CLIENT_ID environment variable.");
}

export async function uploadToImgur(base64Image: string): Promise<string> {
  try {
    toastLoading({
      message: "Uploading image...",
    });

    const response = await fetch(IMGUR_API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image, type: "base64" }),
    });

    if (!response.ok) {
      toastError({
        message: "Failed to upload an image, please try again.",
      });
      throw new Error(`Imgur API responded with ${response.status}: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    toastSuccess({
      message: "Image uploaded successfully!",
    });

    return jsonResponse.data.link;
  } catch (error) {
    toastDismiss();
    toastError({
      message: "Failed to upload an image, please try again.",
    });
    throw error;
  }
}
