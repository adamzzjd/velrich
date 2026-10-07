import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import Brand from "@/models/Brand";
import Size from "@/models/Size";
import Color from "@/models/Color";
import ProductTemplate from "@/models/ProductTemplate";
import GeneralSettings from "@/models/GeneralSettings";
import ThemeSettings from "@/models/ThemeSettings";
import LanguageSettings from "@/models/LanguageSettings";
import CurrencySettings from "@/models/CurrencySettings";
import TaxSettings from "@/models/TaxSettings";
import PaymentSettings from "@/models/PaymentSettings";
import StorageSettings from "@/models/StorageSettings";
import MobileSettings from "@/models/MobileSettings";
import { ensureDefaultStorefrontTranslations } from "@/lib/translationSeed";

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data to ensure clean generation
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Brand.deleteMany({});
    await Size.deleteMany({});
    await Color.deleteMany({});
    await ProductTemplate.deleteMany({});

    // 1. Seed Categories
    const seededCategories = await Category.insertMany([
      { name: "Accessories", slug: "accessories" },
      { name: "Bottoms", slug: "bottoms" },
      { name: "Dresses", slug: "dresses" },
      { name: "Shoes", slug: "shoes" },
      { name: "Tops & Blouses", slug: "tops-blouses" },
    ]);

    // 2. Seed Collections
    const seededCollections = await Collection.insertMany([
      { name: "New Arrivals", slug: "new-arrivals", active: true },
      { name: "Best Sellers", slug: "best-sellers", active: true },
      { name: "Winter Clearance", slug: "winter-clearance", active: false },
      { name: "Featured Products", slug: "featured", active: true },
    ]);

    // 3. Seed Brands
    const seededBrands = await Brand.insertMany([
      { name: "Prada", slug: "prada", active: true },
      { name: "Zara", slug: "zara", active: true },
      { name: "Nike", slug: "nike", active: true },
      { name: "Puma", slug: "puma", active: true },
      { name: "Levi's", slug: "levis", active: true },
    ]);

    // 4. Seed Sizes
    const seededSizes = await Size.insertMany([
      { label: "XS", name: "Extra Small", category: "Apparel" },
      { label: "S", name: "Small", category: "Apparel" },
      { label: "M", name: "Medium", category: "Apparel" },
      { label: "L", name: "Large", category: "Apparel" },
      { label: "XL", name: "Extra Large", category: "Apparel" },
      { label: "XXL", name: "Double Extra Large", category: "Apparel" },
      { label: "38", name: "Shoes Size 38", category: "Footwear" },
      { label: "39", name: "Shoes Size 39", category: "Footwear" },
      { label: "40", name: "Shoes Size 40", category: "Footwear" },
      { label: "41", name: "Shoes Size 41", category: "Footwear" },
      { label: "42", name: "Shoes Size 42", category: "Footwear" },
    ]);

    // 5. Seed Colors
    const seededColors = await Color.insertMany([
      { name: "Crimson Red", hex: "#ef4444", active: true },
      { name: "Emerald Green", hex: "#10b981", active: true },
      { name: "Royal Blue", hex: "#3b82f6", active: true },
      { name: "Vibrant Amber", hex: "#f59e0b", active: true },
      { name: "Deep Obsidian", hex: "#0f172a", active: true },
      { name: "Silver Grey", hex: "#94a3b8", active: true },
      { name: "White", hex: "#ffffff", active: true },
    ]);

    // 6. Seed Product Templates
    const seededTemplates = await ProductTemplate.insertMany([
      { name: "Standard Apparel Template", attributes: ["Sizes (S-XXL)", "Colors (Hex)", "Fabric Composition"], usage: 12 },
      { name: "Footwear Template", attributes: ["Shoe Size", "Upper Material", "Sole Material"], usage: 4 },
      { name: "Jewelry & Accessories", attributes: ["Material Metal", "Weight", "Stone Type"], usage: 4 },
      { name: "Simple Electronic Metric", attributes: ["Power Rating", "Warranty Period", "Model Number"], usage: 0 },
    ]);

    // 7. Seed 20 realistic products
    const seededProducts = await Product.insertMany([
      // category: dresses
      {
        name: "Classic Shirt Dress",
        description: "A comfortable, premium cotton button-down shirt dress. Perfect for smart-casual wear, featuring high-quality stitching and breathable fabric.",
        price: 119.99,
        images: ["/classic_shirt_dress.png"],
        category: "dresses",
        brand: "Zara",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#94a3b8", "#ffffff"],
        stock: 30,
        ratings: 4.8,
        reviewsCount: 12,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Floral Summer Dress",
        description: "An elegant, lightweight summer dress featuring a beautiful floral print. Made from organic linen with a flattering empire waist.",
        price: 89.99,
        salePrice: 109.99,
        images: ["/classic_shirt_dress.png"],
        category: "dresses",
        brand: "Zara",
        sizes: ["XS", "S", "M", "L"],
        colors: ["#ef4444", "#ffffff"],
        stock: 22,
        ratings: 4.6,
        reviewsCount: 8,
        isFeatured: true,
        isOnSale: true,
      },
      {
        name: "Evening Silk Gown",
        description: "A breathtaking pure silk evening gown with a cowl neckline and split leg details. Designed for formal evening events.",
        price: 249.99,
        images: ["/classic_shirt_dress.png"],
        category: "dresses",
        brand: "Prada",
        sizes: ["S", "M", "L"],
        colors: ["#0f172a"],
        stock: 10,
        ratings: 4.9,
        reviewsCount: 15,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Knitted Midi Dress",
        description: "A cozy ribbed knit midi dress with long sleeves and a mock neck structure. Provides warmth and sophistication for cooler seasons.",
        price: 139.99,
        images: ["/classic_shirt_dress.png"],
        category: "dresses",
        brand: "Zara",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#94a3b8"],
        stock: 18,
        ratings: 4.4,
        reviewsCount: 5,
        isFeatured: false,
        isOnSale: false,
      },

      // category: shoes
      {
        name: "Classic Loafers",
        description: "Explore our premium leather loafers designed for the modern woman. Handcrafted with fine leather details, soft insoles, and durable outsoles for maximum comfort.",
        price: 109.99,
        images: ["/classic_loafers.png"],
        category: "shoes",
        brand: "Prada",
        sizes: ["38", "39", "40", "41"],
        colors: ["#0f172a", "#94a3b8"],
        stock: 25,
        ratings: 4.7,
        reviewsCount: 14,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Leather Chelsea Boots",
        description: "Premium handcrafted Chelsea boots featuring elasticated side panels and a back pull tab. Constructed with high-grade full-grain leather.",
        price: 189.99,
        images: ["/classic_loafers.png"],
        category: "shoes",
        brand: "Prada",
        sizes: ["39", "40", "41", "42"],
        colors: ["#0f172a"],
        stock: 12,
        ratings: 5.0,
        reviewsCount: 7,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Sporty Sneakers",
        description: "Ultra-lightweight mesh running sneakers engineered for high impact activity and style. Features responsive cushion foam mid-soles.",
        price: 79.99,
        salePrice: 99.99,
        images: ["/classic_loafers.png"],
        category: "shoes",
        brand: "Nike",
        sizes: ["38", "39", "40", "41", "42"],
        colors: ["#3b82f6", "#ffffff"],
        stock: 40,
        ratings: 4.5,
        reviewsCount: 10,
        isFeatured: false,
        isOnSale: true,
      },
      {
        name: "Elegant High Heels",
        description: "Classic stiletto high heels with a pointed toe and elegant buckle ankle straps. Finished in clean satin fabric.",
        price: 159.99,
        images: ["/classic_loafers.png"],
        category: "shoes",
        brand: "Zara",
        sizes: ["38", "39", "40"],
        colors: ["#ef4444", "#0f172a"],
        stock: 15,
        ratings: 4.3,
        reviewsCount: 4,
        isFeatured: false,
        isOnSale: false,
      },

      // category: accessories
      {
        name: "Gold Lotus Necklace",
        description: "An elegant lotus flower gold pendant necklace. Crafted with 18k gold plating, it is perfect for everyday elegance or special occasions.",
        price: 149.99,
        salePrice: 179.99,
        images: ["/gold_necklace.png"],
        category: "accessories",
        brand: "Prada",
        sizes: ["One Size"],
        colors: ["#f59e0b"],
        stock: 15,
        ratings: 5.0,
        reviewsCount: 9,
        isFeatured: true,
        isOnSale: true,
      },
      {
        name: "Leather Designer Belt",
        description: "A premium leather belt featuring an antique brass double buckle. Perfect for cinching dresses or styling with high-waist jeans.",
        price: 59.99,
        images: ["/gold_necklace.png"],
        category: "accessories",
        brand: "Prada",
        sizes: ["S", "M", "L"],
        colors: ["#0f172a"],
        stock: 20,
        ratings: 4.4,
        reviewsCount: 6,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Silk Square Scarf",
        description: "A luxurious 100% silk square scarf printed with dynamic custom artistic motifs. Versatile accessory for neck, hair, or handbag.",
        price: 45.99,
        images: ["/gold_necklace.png"],
        category: "accessories",
        brand: "Zara",
        sizes: ["One Size"],
        colors: ["#3b82f6", "#f59e0b"],
        stock: 35,
        ratings: 4.7,
        reviewsCount: 3,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Minimalist Wrist Watch",
        description: "A clean minimalist wrist watch featuring a gold plated stainless steel casing and an interchangeable Italian leather strap.",
        price: 199.99,
        images: ["/gold_necklace.png"],
        category: "accessories",
        brand: "Prada",
        sizes: ["One Size"],
        colors: ["#0f172a", "#f59e0b"],
        stock: 8,
        ratings: 4.8,
        reviewsCount: 11,
        isFeatured: true,
        isOnSale: false,
      },

      // category: bottoms
      {
        name: "High Waist Shorts",
        description: "Premium blue denim high waist shorts. Styled for modern streetwear with frayed details and structured denim materials.",
        price: 49.99,
        images: ["/high_waist_shorts.png"],
        category: "bottoms",
        brand: "Levi's",
        sizes: ["S", "M", "L"],
        colors: ["#3b82f6", "#94a3b8"],
        stock: 20,
        ratings: 4.2,
        reviewsCount: 13,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Slim Fit Denim Jeans",
        description: "A classic pair of slim fit stretch denim jeans. Tailored for comfort with contouring curves and a clean raw denim finish.",
        price: 99.99,
        images: ["/high_waist_shorts.png"],
        category: "bottoms",
        brand: "Levi's",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["#3b82f6"],
        stock: 28,
        ratings: 4.6,
        reviewsCount: 14,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Classic Pleated Skirt",
        description: "An elegant pleated midi skirt featuring a high-rise waistline and flowy lightweight fabric. Perfect for smart office attire.",
        price: 69.99,
        salePrice: 89.99,
        images: ["/high_waist_shorts.png"],
        category: "bottoms",
        brand: "Zara",
        sizes: ["XS", "S", "M", "L"],
        colors: ["#0f172a", "#94a3b8"],
        stock: 15,
        ratings: 4.5,
        reviewsCount: 5,
        isFeatured: false,
        isOnSale: true,
      },
      {
        name: "Linen Wide-Leg Trousers",
        description: "Relaxed wide-leg trousers made from high quality breathable linen. Combines effortless casual style with warm weather comfort.",
        price: 79.99,
        images: ["/high_waist_shorts.png"],
        category: "bottoms",
        brand: "Zara",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#ffffff", "#94a3b8"],
        stock: 25,
        ratings: 4.3,
        reviewsCount: 7,
        isFeatured: false,
        isOnSale: false,
      },

      // category: tops-blouses
      {
        name: "Casual White Tee",
        description: "A wardrobe staple made of ultra-soft combed cotton. Features a crew neck, short sleeves, and relaxed fit structure.",
        price: 29.99,
        images: ["/classic_shirt_dress.png"],
        category: "tops-blouses",
        brand: "Levi's",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["#ffffff"],
        stock: 50,
        ratings: 4.5,
        reviewsCount: 15,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Satin V-Neck Blouse",
        description: "An elegant, silky satin long-sleeve blouse with a soft draped V-neckline. Adds instant polish to professional wardrobes.",
        price: 64.99,
        salePrice: 79.99,
        images: ["/classic_shirt_dress.png"],
        category: "tops-blouses",
        brand: "Zara",
        sizes: ["S", "M", "L"],
        colors: ["#10b981", "#ffffff"],
        stock: 20,
        ratings: 4.7,
        reviewsCount: 6,
        isFeatured: true,
        isOnSale: true,
      },
      {
        name: "Oversized Cable Sweater",
        description: "A chunky knit oversized cable sweater. Knitted with high wool blend to provide premium insulation and winter styling.",
        price: 119.99,
        images: ["/classic_shirt_dress.png"],
        category: "tops-blouses",
        brand: "Zara",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#94a3b8", "#0f172a"],
        stock: 14,
        ratings: 4.8,
        reviewsCount: 8,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Linen Button-Up Shirt",
        description: "Classic loose fit button-up shirt crafted from pure organic linen fabric. Breathable, comfortable, and perfect for resort styling.",
        price: 54.99,
        images: ["/classic_shirt_dress.png"],
        category: "tops-blouses",
        brand: "Puma",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#ffffff", "#3b82f6"],
        stock: 25,
        ratings: 4.4,
        reviewsCount: 10,
        isFeatured: false,
        isOnSale: false,
      },
    ]);

    // 8. Seed Settings
    const settingsCount = await GeneralSettings.countDocuments();
    if (settingsCount === 0) {
      await Promise.all([
        GeneralSettings.create({
          storeName: "VELRICH",
          storeEmail: "contact@snapshop.com",
          currency: "$",
          shippingCost: 0,
          promoCode: "FLASH20",
          promoDiscount: 20,
          heroTitle: "Discover Your Style",
          heroSubtitle: "Explore our latest collection of premium fashion designed for the modern woman.",
          heroCountdownDate: new Date(Date.now() + 303 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        }),
        ThemeSettings.create({}),
        LanguageSettings.create({}),
        CurrencySettings.create({}),
        TaxSettings.create({}),
        PaymentSettings.create({}),
        StorageSettings.create({}),
        MobileSettings.create({}),
      ]);
    }

    // 9. Seed Translations Dictionary
    const translationSeed = await ensureDefaultStorefrontTranslations();

    return NextResponse.json({
      message: "Database regenerated and seeded successfully!",
      categoriesCount: seededCategories.length,
      collectionsCount: seededCollections.length,
      brandsCount: seededBrands.length,
      sizesCount: seededSizes.length,
      colorsCount: seededColors.length,
      templatesCount: seededTemplates.length,
      productsCount: seededProducts.length,
      translationsSeeded: translationSeed.insertedCount > 0,
      translationsInserted: translationSeed.insertedCount,
    });
  } catch (error: unknown) {
    console.error("Seeding error:", error);
    const message = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
