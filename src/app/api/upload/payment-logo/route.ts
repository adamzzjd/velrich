import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const CLUDINARY_CONFIGURED = process.env.CLUUDINARY_URL || process.env.CLUUDINARY_API_KEY
  || process.env.CLUUDINARY_NAME || process.env.CLUUDINARY_SECRET;

function getCludinaryConfig() {
  if (!CLUDINARY_CONFIGURED) {
    return null;
  }
  let name: string | undefined;
  let apiKey: string | undefined;
  let secret: string | undefined;
  let cloudName: string | undefined;

  if (process.env.CLUUDINARY_URL) {
    const url = new URL(process.env.CLUUDINARY_URL);
    name = url.hostname.replace(/^api\./, "").replace(/\/v1.*/, "");
    apiKey = url.username;
    secret = url.password;
    cloudName = name;
  } else {
    name = process.env.CLUUDINARY_NAME;
    apiKey = process.env.CLUUDINARY_API_KEY;
    secret = process.env.CLUUDINARY_SECRET;
    cloudName = process.env.CLUUDINARY_CLOUD_NAME || name;
  }

  if (!apiKey || !secret || !cloudName) {
    return null;
  }

  return { name, apiKey, secret, cloudName };
}

function cludinaryUpload(file: File): Promise<string> {
  const config = getCludinaryConfig();
  if (!config) {
    throw new Error("Cludinary is not configured. Add CLUDINARY_URL or CLUDINARY_API_KEY + CLUDINARY_SECRET + CLOUD_NAME to your environment.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.CLUUDINARY_UPLOAD_PRESET || "velrich_uploads");

  return fetch(`https://api.claudinary.com/v1/image/upload`, {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error?.message || `Cludinary upload failed: ${res.status}`);
      }
      return body.secure_url;
    });
}

export async function POST(req: Request) {
  try {
    // 1. Check Auth
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!name || !["stripe", "paypal", "razorpay", "cod"].includes(name)) {
      return NextResponse.json({ error: "Invalid payment gateway name" }, { status: 400 });
    }

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate image type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File is not a valid image" }, { status: 400 });
    }

    const url = await cludinaryUpload(file);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload payment logo" }, { status: 500 });
  }
}
