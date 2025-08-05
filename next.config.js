/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['ccxt'],
  webpack: (config) => {
    config.externals.push({
      'ccxt': 'ccxt'
    });
    return config;
  }
};

module.exports = nextConfig; 