import { Schema, model, models } from "mongoose";

const ItineraryItemSchema = new Schema(
    {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false }
);

const PackageSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        tagline: { type: String, required: true },
        category: {
            type: String,
            enum: ["Hill Stations", "Beaches", "Adventure", "Cultural", "Custom"],
            required: true,
        },
        destination: { type: String, required: true },
        duration: { type: String, required: true },
        groupSize: { type: String, required: true },
        price: { type: Number, required: true },
        priceDisplay: { type: String, required: true },
        overview: { type: String, required: true },
        coverImage: { type: String, required: true },
        gallery: [{ type: String }],
        highlights: [{ type: String }],
        itinerary: [ItineraryItemSchema],
        inclusions: [{ type: String }],
        exclusions: [{ type: String }],
        rating: { type: Number, default: 4.5 },
        reviews: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Package = models.Package || model("Package", PackageSchema);
export default Package;
