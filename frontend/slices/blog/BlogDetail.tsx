"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostView, type BlogPost as SliceBlogPost } from "@/features/blog-section";
import { parseImage, isUrlImage } from "@/features/image-picker";
import { usePost } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { CommentsSection } from "@/features/_app/comments-section";

/**
 * Hybrid wrapper: reads live post via usePost(slug) and feeds the canonical
 * BlogPostView slice. Admin edits propagate via createTemplateStore.
 */
export function BlogDetail({ slug }: { slug: string }) {
  const post = usePost(slug);
  if (!post) {
    return (
      <section>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-sm text-muted-foreground">Post not found.</p>
          <Button asChild variant="ghost" className="mt-4">
            <Link href={`${PUBLIC_BASE}/blog`}><ArrowLeft className="size-4" /> Back to blog</Link>
          </Button>
        </div>
      </section>
    );
  }
  const coverImg = post.cover ? parseImage(post.cover) : null;
  const coverSrc = coverImg && isUrlImage(coverImg) ? coverImg.value : null;
  const slicePost: SliceBlogPost = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    author: post.author,
    publishedAt: post.publishedAt,
    tags: post.tags,
    // image-picker tokens can be css colors / gradients too; only a real URL
    // is a valid next/image src, so we parse + gate the cover on isUrlImage.
    cover: coverSrc ? { src: coverSrc, alt: post.title } : undefined,
  };
  return (
    <div>
      <BlogPostView
        post={slicePost}
        backHref={`${PUBLIC_BASE}/blog`}
        className="!px-6"
      />
      <div className="mx-auto max-w-3xl px-6">
        <CommentsSection kind="blog" slug={post.slug} title="Discussion" />
      </div>
    </div>
  );
}
