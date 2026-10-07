// Fix currency symbol to Nigerian Naira (₦) — run: node scripts/fix-currency.js
const BASE = process.env.BASE_URL || "http://localhost:3000";
const EMAIL = process.env.ADMIN_USER || "admin";
const PASS = process.env.ADMIN_PASS || "admin123";

async function main() {
  // 1. Login
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername: EMAIL, password: PASS }),
  });

  const setCookie = loginRes.headers.get("set-cookie") || "";
  const tokenMatch = setCookie.match(/token=([^;]+)/);
  if (!tokenMatch) {
    console.error("Login failed:", loginRes.status);
    process.exit(1);
  }
  const token = tokenMatch[1];
  console.log("✓ Logged in as admin");

  // 2. Update currency using proper unicode escape for ₦ (U+20A6)
  const payload = { currency: "\u20A6", currencyPos: "before", storeCountry: "Nigeria" };

  const res = await fetch(`${BASE}/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Update failed:", res.status, data);
    process.exit(1);
  }

  console.log("✓ Currency set to:", JSON.stringify(data.currency), "codepoint:", data.currency?.codePointAt(0)?.toString(16));
  console.log("✓ Symbol position:", data.currencyPos);
  console.log("✓ Store country:", data.storeCountry);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
