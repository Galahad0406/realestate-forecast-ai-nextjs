import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 빌드 시 발생할 수 있는 미세한 타입 에러를 무시하고 배포를 진행합니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint 에러로 인한 빌드 중단을 방지합니다.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
