import { NextIntlPlugin } from 'next-intl/plugin';

const withNextIntl = new NextIntlPlugin({
  locales: ['en', 'ko'],
  defaultLocale: 'en'
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ['@expat/ui', '@expat/tax-engine']
};

export default withNextIntl(nextConfig);
