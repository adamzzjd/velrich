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

function cludinaryUpload(files: File[]): Promise<string[]> {
  const config = getCludinaryConfig();
  if (!config) {
    throw new Error("Cludinary is not configured. Add CLUDINARY_URL or CLUDINARY_API_KEY + CLUDINARY_SECRET + CLOUD_NAME to your environment.");
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }
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
      return Array.isArray(body.result) ? body.result.map((r: any) => r.secure_url) : [body.secure_url];
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
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Validate file types (only allow images)
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: `File '${file.name}' is not a valid image` }, { status: 400 });
      }
    }

    const urls = await cludinaryUpload(files);

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload files" }, { status: 500 });
  }
}
