import BlogPostClient from './blog-post-client';

export function generateStaticParams() {
  return [{ slug: 'placeholder' }];
}

export default function Page() {
  return <BlogPostClient />;
}
