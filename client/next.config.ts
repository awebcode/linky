import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
   
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
    // Example of allowing all domains (use with caution)
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "**",
    //   },
    // ],
  },
  // Custom image loader configuration
  // images: {
  //   loader: 'custom',
  //   loaderFile: './my/image/loader.js',
  // },
};

export default nextConfig;
