// Rebrand customer-facing seeded translation strings in DB (en) to VELRICH.
// Scope: only keys containing "SnapShop" in their English value.
// Run: node scripts/rebrand-translations.js
const BASE = process.env.BASE_URL || "http://localhost:3000";

const REPLACEMENTS = {
  thank_you_purchase: "Thank you for your purchase at VELRICH.",
  snapshop_standard_delivery: "VELRICH Standard Delivery",
};

async function main() {
  // 1. Login
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername: "admin", password: "admin123" }),
  });
  const setCookie = loginRes.headers.get("set-cookie") || "";
  const token = (setCookie.match(/token=([^;]+)/) || [])[1];
  if (!token) {
    console.error("Login failed:", loginRes.status);
    process.exit(1);
  }
  const auth = { Cookie: `token=${token}` };

  // 2. Fetch current translations
  const res = await fetch(`${BASE}/api/admin/translations`, { headers: auth });
  if (!res.ok) {
    console.error("Fetch translations failed:", res.status);
    process.exit(1);
  }
  const items = await res.json();
  console.log(`Fetched ${items.length} translation keys`);

  // 3. Build updates for keys whose "en" value contains SnapShop
  const updates = [];
  for (const item of items) {
    const en = item.translations && item.translations.en;
    if (typeof en !== "string" || !en.includes("SnapShop")) continue;

    let newEn = en;
    for (const [key, val] of Object.entries(REPLACEMENTS)) {
      if (item.key === key) newEn = val;
    }
    // Generic fallback: replace the word SnapShop with VELRICH
    if (newEn === en) newEn = en.split("SnapShop").join("VELRICH");

    const translations = { ...item.translations, en: newEn };
    updates.push({ key: item.key, translations });
    console.log("update:", item.key, "->", newEn);
  }

  if (updates.length === 0) {
    console.log("No SnapShop strings found. Nothing to update.");
    return;
  }

  // 4. PUT update-manual
  const putRes = await fetch(`${BASE}/api/admin/translations`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify({ action: "update-manual", updates }),
  });
  const out = await putRes.json();
  if (!putRes.ok) {
    console.error("Update failed:", putRes.status, out);
    process.exit(1);
  }
  console.log(`✓ Updated ${updates.length} translation keys to VELRICH`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
