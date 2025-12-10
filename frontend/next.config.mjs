import createMDX from '@next/mdx';

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

  // Enable MDX Rust compiler
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
