import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
    {
        /* ── User Info ── */
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        travelers: { type: Number, required: true, min: 1 },
        travelDate: { type: String, required: true },
        specialRequests: { type: String, default: "" },

        /* ── Package Info ── */
        packageId: { type: String, required: true },
        packageSlug: { type: String, required: true },
        packageName: { type: String, required: true },
        pricePerPerson: { type: Number, required: true },
        totalAmount: { type: Number, required: true },

        /* ── Payment Info ── */
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String, default: "" },
        razorpaySignature: { type: String, default: "" },
        paymentStatus: {
            type: String,
            enum: ["created", "paid", "failed", "refunded"],
            default: "created",
        },

        /* ── Booking Status ── */
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },

        /* ── User ID (optional – for logged-in users) ── */
        userId: { type: String, default: "" },
    },
    { timestamps: true }
);

// Index for quick lookups
BookingSchema.index({ email: 1 });
BookingSchema.index({ razorpayOrderId: 1 });
BookingSchema.index({ paymentStatus: 1 });

const Booking = models.Booking || model("Booking", BookingSchema);
export default Booking;
