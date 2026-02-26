import { connectDB } from "@/lib/mongodb";
import BlogPostModel from "@/lib/models/BlogPost";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    await connectDB();

    const posts = await BlogPostModel.find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .lean();

    const serialized = posts.map((p) => ({
        ...p,
        _id: String(p._id),
        publishedAt: p.publishedAt?.toISOString() || new Date().toISOString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));

    return (
        <>
            <Navbar />

            {/* Hero */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-light) 100%)",
                    paddingTop: "8rem",
                    paddingBottom: "3rem",
                }}
            >
                <div className="container-custom">
                    <div
                        className="tag"
                        style={{ marginBottom: "1rem", display: "inline-block" }}
                    >
                        📝 Travel Blog
                    </div>
                    <h1
                        style={{
                            fontFamily: "var(--font-outfit)",
                            fontWeight: 900,
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            color: "var(--color-text)",
                            marginBottom: "1rem",
                        }}
                    >
                        Stories from the{" "}
                        <span className="gradient-text">Road</span>
                    </h1>
                    <p
                        style={{
                            color: "var(--color-muted)",
                            fontSize: "1.05rem",
                            maxWidth: "560px",
                            lineHeight: 1.7,
                        }}
                    >
                        Travel tips, destination guides, and stories from our
                        adventures across India.
                    </p>
                </div>
            </section>

            <main className="section-padding">
                <div className="container-custom">
                    {serialized.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "4rem 2rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "3rem",
                                    marginBottom: "1rem",
                                }}
                            >
                                ✍️
                            </p>
                            <p
                                style={{
                                    fontSize: "1.2rem",
                                    color: "var(--color-muted)",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                No blog posts yet.
                            </p>
                            <p
                                style={{
                                    color: "var(--color-muted)",
                                    fontSize: "0.875rem",
                                }}
                            >
                                Check back soon for travel stories and guides!
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(320px, 1fr))",
                                gap: "1.5rem",
                            }}
                        >
                            {serialized.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

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
