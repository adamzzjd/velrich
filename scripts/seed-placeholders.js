const sharp = require("sharp");
const path = require("path");

const PUBLIC = path.join(__dirname, "..", "public");

// Generic placeholder — used site-wide via /placeholder.png
const basePlaceholder = `
  <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1e293b"/>
        <stop offset="1" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <text x="300" y="280" text-anchor="middle" font-family="Outfit, sans-serif"
      font-size="28" fill="#475569" font-weight="500">VELRICH</text>
    <text x="300" y="320" text-anchor="middle" font-family="Outfit, sans-serif"
      font-size="16" fill="#64748b">No Image Available</text>
    <circle cx="300" cy="200" r="40" fill="none" stroke="#334155" stroke-width="2"/>
    <path d="M270 200l30 30 30-50" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

// Category-themed placeholders
const themed = {
  "/classic_shirt_dress.png": `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fce7f3"/><stop offset="1" stop-color="#fbcfe8"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#g1)"/>
    <text x="300" y="310" text-anchor="middle" font-family="Outfit, sans-serif" font-size="20" fill="#be185d" font-weight="600">Dresses</text>
  </svg>`,
  "/classic_loafers.png": `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#bfdbfe"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#g2)"/>
    <text x="300" y="310" text-anchor="middle" font-family="Outfit, sans-serif" font-size="20" fill="#1d4ed8" font-weight="600">Shoes</text>
  </svg>`,
  "/gold_necklace.png": `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef3c7"/><stop offset="1" stop-color="#fde68a"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#g3)"/>
    <text x="300" y="310" text-anchor="middle" font-family="Outfit, sans-serif" font-size="20" fill="#92400e" font-weight="600">Accessories</text>
  </svg>`,
  "/high_waist_shorts.png": `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#7dd3fc"/></linearGradient></defs>
    <rect width="600" height="600" fill="url(#g4)"/>
    <text x="300" y="310" text-anchor="middle" font-family="Outfit, sans-serif" font-size="20" fill="#0c4a6e" font-weight="600">Bottoms &amp; Tops</text>
  </svg>`,
};

async function main() {
  // Generic placeholder
  await sharp(Buffer.from(basePlaceholder))
    .png()
    .toFile(path.join(PUBLIC, "placeholder.png"));
  console.log("✓ Created public/placeholder.png");

  // Category-themed
  for (const [relPath, svg] of Object.entries(themed)) {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(PUBLIC, relPath));
    console.log(`✓ Created public${relPath}`);
  }

  console.log("All placeholder images created.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
