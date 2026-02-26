"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

type Props = {
    post: {
        slug: string;
        title: string;
        excerpt: string;
        coverImage?: string;
        tags: string[];
        author: string;
        publishedAt: string;
        content: string;
    };
};

export default function BlogCard({ post }: Props) {
    const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

    return (
        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
            <article
                className="glass hover-lift"
                style={{
                    overflow: "hidden",
                    borderRadius: "1.25rem",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(192,92,58,0.3)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--color-border)";
                }}
            >
                {post.coverImage && (
                    <div style={{ height: "200px", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.transform =
                                    "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                                ((e.target as HTMLElement).style.transform =
                                    "scale(1)")
                            }
                        />
                    </div>
                )}
                <div style={{ padding: "1.5rem" }}>
                    {post.tags.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                                marginBottom: "0.75rem",
                            }}
                        >
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="tag"
                                    style={{ fontSize: "0.6rem" }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "var(--color-text)",
                            marginBottom: "0.5rem",
                            lineHeight: 1.3,
                        }}
                    >
                        {post.title}
                    </h3>

                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "0.875rem",
                            lineHeight: 1.6,
                            marginBottom: "1rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {post.excerpt}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                fontSize: "0.78rem",
                                color: "var(--color-muted)",
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                }}
                            >
                                <Calendar size={12} /> {date}
                            </span>
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                }}
                            >
                                <Clock size={12} /> {readTime} min read
                            </span>
                        </div>
                        <ArrowRight
                            size={16}
                            style={{ color: "var(--color-terracotta)" }}
                        />
                    </div>
                </div>
            </article>
        </Link>
    );
}
