/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  // IMPORTANTE: DESACTIVAR STATIC EXPORT
  dynamic: "force-dynamic",
};

export default nextConfig;
