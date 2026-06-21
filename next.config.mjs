/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['framer-motion', 'gsap', '@react-three/drei'] },
};
export default nextConfig;
