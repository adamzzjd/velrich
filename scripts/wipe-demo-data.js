// Wipe demo brands & collections via the app's admin API (keeps products/settings).
// Run: node scripts/wipe-demo-data.js
const BASE = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  // 1. Login as admin
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

  // 2. Fetch current brands + collections (auth cookie required)
  const authHeaders = { Cookie: `token=${token}` };
  const [brandsRes, collectionsRes] = await Promise.all([
    fetch(`${BASE}/api/admin/products/brands`, { headers: authHeaders }),
    fetch(`${BASE}/api/admin/products/collections`, { headers: authHeaders }),
  ]);

  const brands = await brandsRes.json();
  const collections = await collectionsRes.json();

  console.log("Brands:", JSON.stringify(brands).slice(0, 300));
  console.log("Collections:", JSON.stringify(collections).slice(0, 300));

  const brandList = Array.isArray(brands) ? brands : brands.brands || [];
  const collectionList = Array.isArray(collections) ? collections : collections.collections || [];

  // 3. Delete all
  let db = 0, dc = 0;
  for (const b of brandList) {
    const r = await fetch(`${BASE}/api/admin/products/brands/${b._id}`, {
      method: "DELETE",
      headers: { Cookie: `token=${token}` },
    });
    if (r.ok) db++;
  }
  for (const c of collectionList) {
    const r = await fetch(`${BASE}/api/admin/products/collections/${c._id}`, {
      method: "DELETE",
      headers: { Cookie: `token=${token}` },
    });
    if (r.ok) dc++;
  }

  console.log(`✓ Deleted ${db} demo brands`);
  console.log(`✓ Deleted ${dc} demo collections`);
  console.log("Products, settings, and admin account untouched.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
