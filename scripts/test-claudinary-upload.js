const http = require("http");
const fs = require("fs");
const path = require("path");

// Start the Next.js dev server if not already running
const { spawn } = require("child_process");
let devServer;

function startDevServer() {
  return new Promise((resolve, reject) => {
    devServer = spawn("npm", ["run", "dev"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: "3456" },
    });

    let out = "";
    devServer.stdout.on("data", (d) => {
      out += d.toString();
      if (out.includes("started")) {
        resolve();
      }
    });

    devServer.stderr.on("data", (d) => {
      const msg = d.toString();
      if (!msg.includes("Compiled")) console.error(msg);
    });

    devServer.on("error", reject);
    devServer.on("close", (code) => {
      if (code !== 0 && !process.env.SKIP_CLEANUP) {
        console.error(`\nDev server exited with code ${code}`);
      }
    });

    setTimeout(() => {
      if (!out.includes("started")) reject(new Error("Dev server did not start in time"));
    }, 15000);
  });
}

async function httpPost(url, formData) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });

    req.on("error", reject);
    req.write(formData);
    req.end();
  });
}

async function main() {
  const TEST_IMAGE = path.join(__dirname, "..", "public", "images", "Products", "1791292268251-Statement_of_Result.png");

  if (!fs.existsSync(TEST_IMAGE)) {
    console.log("No test image found at", TEST_IMAGE);
    console.log("Skipping Cludinary upload test.");
    return;
  }

  console.log("Starting dev server...");
  await startDevServer();
  console.log("Dev server running.\n");

  const form = `--boundary\r
Content-Disposition: form-data; name="files"; filename="test.png"\r
Content-Type: image/png\r
\r
TESTBUFFER\r
--boundary--\r
`;

  try {
    const result = await httpPost("http://localhost:3456/api/upload", form);
    console.log("Upload result:", JSON.stringify(result, null, 2));
    if (result.status === 200 && result.body.url) {
      console.log("\n✅ Cludinary upload flow works.");
      console.log("   Cludinary URL:", result.body.url);
    } else {
      console.log("\n❌ Upload did not return a URL. Status:", result.status);
      console.log("   Body:", JSON.stringify(result.body));
    }
  } catch (err) {
    console.error("❌ Upload request failed:", err.message);
  } finally {
    if (devServer && !process.env.SKIP_CLEANUP) {
      devServer.kill("SIGTERM");
      console.log("\nDev server stopped.");
    }
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
