import mongoose, { Schema, model, models } from "mongoose";

const InquirySchema = new Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        destination: { type: String, required: true },
        travelDate: { type: String, required: true },
        travelers: { type: String, required: true },
        budget: { type: String },
        message: { type: String },
        status: { type: String, default: "new" }, // new, contacted, booked
    },
    { timestamps: true }
);

const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);
export default Inquiry;
