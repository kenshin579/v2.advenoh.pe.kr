/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 정적 사이트 생성
  images: {
    unoptimized: true  // 정적 호스팅용 (Netlify에서 이미지 최적화 불필요)
  },
  // 경로 별칭은 tsconfig.json에서 관리
}

export default nextConfig
