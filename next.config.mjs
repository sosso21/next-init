import dotenv from "dotenv";

if (process.env.APP_ENV === "testing") {
  // expecting to overwrite DATABASE_URL and other params
  dotenv.config({ path: ".env", override: true });
} else if (process.env.APP_ENV === "development") {
  dotenv.config({ path: ".env", override: true });
}
const { DEFAULT_LANG } = process.env; // for some reason it has no issue reading the variables from here

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  env: { DEFAULT_LANG },
};

export default nextConfig;
