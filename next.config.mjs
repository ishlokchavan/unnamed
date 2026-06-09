/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // serve AVIF/WebP variants of the local frames automatically
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
