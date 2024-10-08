/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/',
            destination: '/login',
            permanent: true,
          }
        ]
      },
    
};

export default nextConfig;
