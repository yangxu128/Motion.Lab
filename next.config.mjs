/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['framer-motion', 'gsap', '@react-three/drei'] },
  // 生产环境移除 console（保留 error）
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};
export default nextConfig;
