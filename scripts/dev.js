#!/usr/bin/env node
/*
 * SnapShop local development launcher.
 *
 * Starts a zero-install in-memory MongoDB (https://www.npmjs.com/package/mongodb-memory-server)
 * listening on 127.0.0.1:27017 and then boots the Next.js dev server on
 * http://localhost:3000 — all from a single `npm run dev`.
 *
 * Data is persisted under ./.mongodb-data so the install wizard only needs to
 * be run once. Delete that folder to start fresh.
 *
 * Once you have a real MongoDB (e.g. Atlas or a local mongod), simply stop this
 * launcher and run `npx next dev` directly with your own MONGODB_URI.
 */
const path = require("path");
const os = require("os");
const fs = require("fs");
const { spawn } = require("child_process");
const { MongoMemoryServer } = require("mongodb-memory-server");

const PORT = 27017;
const DB_NAME = "snapshop";
const DATA_DIR = path.resolve(process.cwd(), ".mongodb-data");
fs.mkdirSync(DATA_DIR, { recursive: true });

let mongod = null;
let nextChild = null;
// Resolved path of a local mongod.exe to reuse instead of downloading.
const systemBinaryRef = { current: null };

function shutdown() {
  console.log("\n[dev] Shutting down...");
  if (nextChild && !nextChild.killed) {
    nextChild.kill("SIGTERM");
  }
  if (mongod) {
    mongod
      .stop({ doCleanup: false })
      .then(() => process.exit(0))
      .catch(() => process.exit(0));
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function createMongo() {
  return MongoMemoryServer.create({
    binary: {
      version: "8.2.6",
      ...(systemBinaryRef.current ? { systemBinary: systemBinaryRef.current } : {}),
    },
    instance: {
      port: PORT,
      dbName: DB_NAME,
      dbPath: DATA_DIR,
      ip: "127.0.0.1",
      // Windows cold starts (antivirus scanning the 77MB binary, WiredTiger
      // recovery) can exceed the 10s default.
      launchTimeout: 30000,
    },
  });
}

/*
 * The Windows mongod 8.2.6 binary can crash (exit code 14) while recovering a
 * data dir left by an unclean shutdown (e.g. taskkill /F or a power loss).
 * When that happens, move the corrupt data aside and retry once with an empty
 * dir so a broken shutdown doesn't require manual cleanup. The renamed folder
 * is kept as .mongodb-data.corrupt-TIMESTAMP in case anything is worth saving.
 */
async function startMongo() {
  try {
    return await createMongo();
  } catch (firstError) {
    const hasData = fs.existsSync(DATA_DIR) && fs.readdirSync(DATA_DIR).length > 0;
    if (!hasData) throw firstError;
    const backup = DATA_DIR + ".corrupt-" + Date.now();
    console.warn("[dev] MongoDB failed to start with existing data (", firstError && firstError.message, ")");
    console.warn("[dev] Moving corrupt data dir to", backup, "and retrying...");
    fs.renameSync(DATA_DIR, backup);
    fs.mkdirSync(DATA_DIR, { recursive: true });
    return createMongo();
  }
}

(async () => {
  // Prefer a locally extracted mongod.exe (avoids mongodb-memory-server's own
  // slow/unreliable binary download). Falls back to its normal download.
  const candidates = [
    process.env.MONGOMS_SYSTEM_BINARY,
    path.join(
      os.homedir(),
      ".cache",
      "mongodb-binaries",
      "mongod-8.2.6",
      "mongodb-win32-x86_64-windows-8.2.6",
      "bin",
      "mongod.exe"
    ),
    // mongodb-memory-server's default download location (Windows naming convention)
    path.join(
      os.homedir(),
      ".cache",
      "mongodb-binaries",
      "mongod-x64-win32-8.2.6.exe"
    ),
  ].filter(Boolean);
  const systemBinary = candidates.find((p) => fs.existsSync(p));
  systemBinaryRef.current = systemBinary;
  if (systemBinary) {
    console.log("[dev] Using local mongod binary:", systemBinary);
  }

  console.log("[dev] Starting in-memory MongoDB on 127.0.0.1:" + PORT + " ...");
  try {
    mongod = await startMongo();
  } catch (e) {
    console.error("[dev] Failed to start MongoDB:", e && e.message);
    process.exit(1);
  }

  const uri = mongod.getUri(DB_NAME);
  // Make it available to Next.js route handlers / lib/db.ts
  process.env.MONGODB_URI = uri;
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "snapshop_dev_2f8a1c9e7b3d4f6a0c5e8b2d9f1a7c3e8f4b6d2";
  }
  console.log("[dev] MongoDB ready ->", uri);

  const nextBin = require.resolve("next/dist/bin/next");
  const args = ["dev", "-p", "3000"];
  nextChild = spawn(process.execPath, [nextBin, ...args], {
    stdio: "inherit",
    env: process.env,
  });

  nextChild.on("close", (code) => {
    console.log("[dev] Next process exited with code", code);
    shutdown();
  });
})().catch((err) => {
  console.error("[dev] Launcher error:", err);
  process.exit(1);
});
