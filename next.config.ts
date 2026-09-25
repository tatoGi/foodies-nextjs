import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Dev only: the local stack is opened as http://127.0.0.1:3000 (CMS/POS use 127.0.0.1 too).
  allowedDevOrigins: ['127.0.0.1']
};

export default withNextIntl(nextConfig);
