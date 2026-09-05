import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dojiw2m9tvv09.cloudfront.net',
        pathname: '/85899/**',
      },
    ],
    // El logo de marca en public/ es SVG. Next lo bloquea por defecto (riesgo de XSS si
    // el SVG trajera <script>); ya lo revisamos y son solo <path>/<polygon>, sin scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
