import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { 
    unoptimized: true 
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'alsmxiwq'
  }
};

export default nextConfig;
