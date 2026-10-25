/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // l'ancienne page « Champs » est devenue « Offres »
  async redirects() {
    return [{ source: "/services", destination: "/offres", permanent: true }];
  },
};

export default nextConfig;
