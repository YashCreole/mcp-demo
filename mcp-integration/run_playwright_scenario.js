import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkServerReady(url, maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // Ignored: server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
}

async function runScenario() {
  console.log('🚀 Starting Vite development server in the background...');
  
  // Start the Vite dev server in the background
  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
    shell: true
  });

  const url = 'http://localhost:5173';
  
  try {
    console.log(`⏳ Waiting for Vite dev server to be ready at ${url}...`);
    const isReady = await checkServerReady(url);
    if (!isReady) {
      throw new Error(`Failed to connect to Vite dev server at ${url} after several attempts.`);
    }
    console.log('✅ Vite dev server is up and running!');

    console.log('🌐 Launching Chromium via Playwright...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    // Verify Title
    const title = await page.title();
    console.log(`Page title: "${title}"`);

    // Verify Heading
    const heading = await page.textContent('h1');
    console.log(`Heading text: "${heading}"`);

    // Locate the Counter Button
    const counterBtn = page.locator('button.counter');
    let text = await counterBtn.textContent();
    console.log(`Initial button text: "${text.trim()}"`);

    console.log('Clicking the counter button...');
    await counterBtn.click();

    // Verify text updated
    text = await counterBtn.textContent();
    console.log(`Updated button text: "${text.trim()}"`);

    if (text.includes('Count is 1')) {
      console.log('🎉 Scenario verified successfully! The counter incremented.');
    } else {
      console.error('❌ Counter verification failed.');
    }

    // Save screenshot
    const screenshotPath = path.resolve(__dirname, 'scenario-screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);

    await browser.close();
  } catch (error) {
    console.error('❌ Error running scenario:', error.message);
  } finally {
    console.log('🧹 Shutting down Vite development server...');
    try {
      devServer.kill('SIGINT');
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', devServer.pid, '/f', '/t']);
      } else {
        process.kill(-devServer.pid, 'SIGINT');
      }
    } catch (e) {
      // Ignored: process might already be terminated
    }
    console.log('👋 Done.');
    process.exit(0);
  }
}

runScenario();
