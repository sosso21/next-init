import dotenv from "dotenv";

if (process.env.APP_ENV === "testing") {
  // expecting to overwrite DATABASE_URL and other params
  dotenv.config({ path: ".env", override: true });
} else if (process.env.APP_ENV === "development") {
  dotenv.config({ path: ".env", override: true });
}
const { DEFAULT_LANGUAGE, IMAGE_UPLOAD_URL } = process.env; // for some reason it has no issue reading the variables from here

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "assets.aceternity.com",
      "avatar.vercel.sh",
      "cdn0.mariages.net",
      "api.dicebear.com",
      "images.unsplash.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "www.mariages.net",
      "127.0.0.1",
    ],
  },
  env: { DEFAULT_LANGUAGE, IMAGE_UPLOAD_URL },
};

export default nextConfig;
