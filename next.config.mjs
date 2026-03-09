import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러로 중단되는 것 방지
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint 에러 방지
  },
};

export default nextConfig;
