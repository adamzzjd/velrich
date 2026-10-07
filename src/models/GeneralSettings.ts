import mongoose, { Schema, model, models } from "mongoose";

const GeneralSettingsSchema = new Schema(
  {
    storeName: { type: String, default: "VELRICH" },
    storeEmail: { type: String, default: "contact@snapshop.com" },
    websiteLink: { type: String, default: "snapshop.gadohost.com" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    currency: { type: String, default: "$" },
    shippingCost: { type: Number, default: 0 },
    promoCode: { type: String, default: "WELCOME10" },
    promoDiscount: { type: Number, default: 10 },
    heroTitle: { type: String, default: "Discover Your Style" },
    heroSubtitle: { type: String, default: "Explore our latest collection of premium fashion designed for the modern woman." },
    heroImageUrl: { type: String, default: "/hero_fashion_girl.jpg" },
    heroCountdownDate: { type: Date, default: () => new Date(Date.now() + 300 * 24 * 60 * 60 * 1000) },
    storeCountry: { type: String, default: "Morocco" },
    activeZones: { type: [String], default: ["Worldwide"] },
    shippingPolicy: { 
      type: String, 
      default: "We offer fast and reliable shipping to all locations. Orders are typically processed within 1-2 business days and delivered within 3-5 business days." 
    },
    returnsPolicy: { 
      type: String, 
      default: "We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging with tags attached." 
    },
    sizeGuideContent: { 
      type: String, 
      default: "How to Measure:\n- Bust/Chest: Measure around the fullest part of your bust, keeping the tape level.\n- Waist: Measure around your natural waistline, which is the narrowest part of your waist.\n- Hips: Measure around the fullest part of your hips, approximately 7-8 inches below your waist." 
    },
    productUrlFormat: {
      type: String,
      enum: ["id", "slug"],
      default: "slug",
    },
  },
  { timestamps: true }
);

if (models.GeneralSettings) {
  delete models.GeneralSettings;
}

const GeneralSettings = model("GeneralSettings", GeneralSettingsSchema);

export default GeneralSettings;
