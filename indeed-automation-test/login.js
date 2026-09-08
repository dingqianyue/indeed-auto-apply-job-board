const { chromium } = require('playwright');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function runLogin() {
  console.log("🚀 Launching browser...");

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--no-sandbox'
    ]
  });

  // Set a standard desktop viewport and user agent
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  console.log("🌐 Navigating to Indeed homepage...");
  // Using 'domcontentloaded' prevents timeouts or abort errors caused by analytics scripts
  await page.goto('https://www.indeed.com', { waitUntil: 'domcontentloaded' });

  console.log("\n🛑 MANUAL STEP REQUIRED 🛑");
  console.log("1. In the open Chrome window, click 'Sign in' in the top-right corner.");
  console.log("2. Enter your email, solve any CAPTCHA / 2FA verification manually.");
  console.log("3. Once you are successfully logged in and see your account profile/dashboard,");
  console.log("   return to this terminal and press ENTER.");

  await new Promise((resolve) => {
    rl.question('\nPress ENTER to save session state...', resolve);
  });

  console.log("💾 Saving session to playwright/.auth/auth.json...");
  await context.storageState({ path: 'playwright/.auth/auth.json' });

  console.log("✅ Success! Session saved to playwright/.auth/auth.json");
  await browser.close();
  rl.close();
}

runLogin().catch((err) => {
  console.error("❌ Unexpected error:", err);
  rl.close();
});
