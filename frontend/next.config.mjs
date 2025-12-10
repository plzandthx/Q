/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for GitHub Pages static export
  output: 'export',

  // Page extensions including MDX
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
