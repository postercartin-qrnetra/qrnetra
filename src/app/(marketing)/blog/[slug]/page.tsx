import { StubPage } from "@/components/stub-page";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return (
    <StubPage
      title={`Article: ${slug}`}
      description="Long-form SEO content — CMS or MDX later."
      breadcrumb={[{ href: "/blog", label: "Blog" }, { href: `/blog/${slug}`, label: slug }]}
    />
  );
}
