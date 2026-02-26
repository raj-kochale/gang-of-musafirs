import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        coverImage: { type: String, default: "" },
        tags: [{ type: String }],
        author: { type: String, default: "GangOfMusafirs" },
        isPublished: { type: Boolean, default: false },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);

const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
export default BlogPost;
