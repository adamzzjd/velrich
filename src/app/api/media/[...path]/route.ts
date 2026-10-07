import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Static file serving for public/images.
 *
 * NOTE: This route is kept as a fallback for LOCAL development only.
 * On Vercel (serverless), public/ is read-only and any uploaded images
 * are stored on Cludinary's CDN, not on disk. This route returns 404 for
 * anything that isn't a real local public/ file, so the storefront never
 * accidentally falls back to a stale local upload.
 */
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;

  // Only serve files that actually live under public/images/
  if (pathArray.length === 0 || pathArray[0] !== "images") {
    return new NextResponse("File not found", { status: 404 });
  }

  const rest = pathArray.slice(1);
  const filePath = path.join(process.cwd(), "public", ...rest);

  try {
    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".svg") contentType = "image/svg+xml";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".ico") contentType = "image/x-icon";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
