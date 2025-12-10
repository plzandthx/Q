import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Helps when exporting to static HTML
  // (configure-pages also sets this at build time)
  output: 'export',
};

module.exports = nextConfig;
