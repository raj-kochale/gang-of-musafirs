import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, Tag, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();
    const post = await BlogPostModel.findOne({
        slug,
        isPublished: true,
    }).lean();

    if (!post) return { title: "Post Not Found" };

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    await connectDB();
    const post = await BlogPostModel.findOne({
        slug,
        isPublished: true,
    }).lean();

    if (!post) return notFound();

    const date = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "";
    const readTime = Math.max(
        1,
        Math.ceil(post.content.split(/\s+/).length / 200)
    );

    // Render content: split by double newlines into paragraphs
    const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

    return (
        <>
            <Navbar />

            {/* Hero */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
                    paddingTop: "clamp(6rem, 12vw, 8rem)",
                    paddingBottom: "2rem",
                }}
            >
                <div
                    className="container-custom"
                    style={{ maxWidth: "800px" }}
                >
                    <Link
                        href="/blog"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            color: "var(--color-terracotta)",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>

                    {post.tags && post.tags.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                                marginBottom: "1rem",
                            }}
                        >
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 900,
                            fontSize: "clamp(1.75rem, 5vw, 3rem)",
                            color: "var(--color-text)",
                            lineHeight: 1.15,
                            marginBottom: "1.25rem",
                        }}
                    >
                        {post.title}
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            gap: "1.5rem",
                            alignItems: "center",
                            color: "var(--color-muted)",
                            fontSize: "0.875rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 600,
                                color: "var(--color-text)",
                            }}
                        >
                            {post.author}
                        </span>
                        {date && (
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                }}
                            >
                                <Calendar size={14} /> {date}
                            </span>
                        )}
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }}
                        >
                            <Clock size={14} /> {readTime} min read
                        </span>
                    </div>
                </div>
            </section>

            {/* Cover Image */}
            {post.coverImage && (
                <div
                    style={{
                        maxWidth: "800px",
                        margin: "-1rem auto 0",
                        padding: "0 1.5rem",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{
                            width: "100%",
                            borderRadius: "1rem",
                            maxHeight: "450px",
                            objectFit: "cover",
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <article
                className="section-padding"
                style={{ paddingTop: "2.5rem" }}
            >
                <div
                    className="container-custom"
                    style={{ maxWidth: "800px" }}
                >
                    {paragraphs.map((para: string, i: number) => (
                        <p
                            key={i}
                            style={{
                                color: "var(--color-text)",
                                fontSize: "1.05rem",
                                lineHeight: 1.85,
                                marginBottom: "1.5rem",
                            }}
                        >
                            {para}
                        </p>
                    ))}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div
                            style={{
                                borderTop: "1px solid var(--color-border)",
                                paddingTop: "1.5rem",
                                marginTop: "2rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <Tag
                                size={16}
                                style={{ color: "var(--color-muted)" }}
                            />
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>

            {/* CTA */}
            <section
                style={{
                    background: "var(--color-surface)",
                    borderTop: "1px solid var(--color-border)",
                    padding: "4rem 0",
                }}
            >
                <div
                    className="container-custom"
                    style={{ textAlign: "center" }}
                >
                    <h2
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 800,
                            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                            color: "var(--color-text)",
                            marginBottom: "1rem",
                        }}
                    >
                        Ready to Experience This?
                    </h2>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            marginBottom: "2rem",
                            maxWidth: "440px",
                            margin: "0 auto 2rem",
                        }}
                    >
                        Turn this inspiration into reality. Let us plan your
                        perfect trip.
                    </p>
                    <Link
                        href="/packages"
                        className="btn-primary"
                        style={{ fontSize: "1.05rem" }}
                    >
                        Explore Packages
                    </Link>
                </div>
            </section>

            <a
                href="https://wa.me/917354177879"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={26} color="white" fill="white" />
            </a>
            <Footer />
        </>
    );
}
