import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import GeneralSettings from "@/models/GeneralSettings";
import Category from "@/models/Category";
import Collection from "@/models/Collection";
import Brand from "@/models/Brand";
import Size from "@/models/Size";
import Color from "@/models/Color";
import ProductTemplate from "@/models/ProductTemplate";
import Bundle from "@/models/Bundle";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { storeName, websiteLink, username, email, password } = await req.json();
    
    if (!storeName || !websiteLink || !username || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    // Check if an admin already exists to prevent re-installation
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Installation already completed." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin User
    const adminUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      passwordSet: true,
    });

    // Create General Settings
    await GeneralSettings.create({
      storeName,
      websiteLink,
      storeEmail: email,
    });

    // --- Create Default Entries ---
    
    // (Models are now statically imported at the top)

    // Categories
    await Category.create([
      { name: "Accessories", slug: "accessories" },
      { name: "Bottoms", slug: "bottoms" },
      { name: "Dresses", slug: "dresses" },
      { name: "Shoes", slug: "shoes" },
      { name: "Tops & Blouses", slug: "tops-blouses" }
    ]);

    // Collections
    await Collection.create([
      { name: "Summer Collection", slug: "summer-collection" },
      { name: "Winter Collection", slug: "winter-collection" }
    ]);

    // Brands
    await Brand.create([
      { name: "Nike", slug: "nike" },
      { name: "Adidas", slug: "adidas" },
      { name: "Zara", slug: "zara" }
    ]);

    // Sizes
    await Size.create([
      { label: "Extra Small", name: "XS", category: "Apparel" },
      { label: "Small", name: "S", category: "Apparel" },
      { label: "Medium", name: "M", category: "Apparel" },
      { label: "Large", name: "L", category: "Apparel" },
      { label: "Extra Large", name: "XL", category: "Apparel" }
    ]);

    // Colors
    await Color.create([
      { name: "Red", hex: "#FF0000" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" }
    ]);

    // Product Templates
    await ProductTemplate.create([
      { name: "Standard T-Shirt", attributes: ["Size", "Color", "Material"] },
      { name: "Shoes", attributes: ["Size", "Color", "Style"] }
    ]);

    // Bundles
    await Bundle.create([
      { name: "Welcome Pack", discount: 10, itemsCount: 2, status: "Active" },
      { name: "Summer Special", discount: 20, itemsCount: 3, status: "Active" }
    ]);
    
    // ------------------------------

    // Sign JWT Token
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Set cookie response
    const response = NextResponse.json({ success: true, message: "Installation completed successfully!" });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Revalidate the root layout so it stops redirecting to /install
    revalidatePath("/", "layout");

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
