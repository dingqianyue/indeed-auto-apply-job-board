
const fs = require('fs').promises;
const { chromium } = require('playwright');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DB_PATH = '../client/public/applications.json';

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log("Could not read applications.json. Make sure the file exists.");
    return [];
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function runAutoApply() {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error("Please provide a job URL as an argument.");
    process.exit(1);
  }

  const jobs = await readDB();
  
  console.log("Launching browser with saved session...");
  const browser = await chromium.launch({ 
    headless: false, 
    channel: 'chrome',
    args: [
      '--disable-blink-features=AutomationControlled', 
      '--disable-infobars',
      '--no-sandbox'
    ]
  });

  const context = await browser.newContext({
    storageState: 'playwright/.auth/auth.json',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    
    if (job.url !== targetUrl) {
      continue;
    }

    if (job.status !== 'pending') {
      console.log(`Job ${job.url} is not pending (status: ${job.status}).`);
      continue;
    }

    console.log(`\n----------------------------------------`);
    console.log(`Processing Job: ${job.url}`);
    job.status = 'in_progress';
    await writeDB(jobs);

    try {
      await page.goto(job.url, { waitUntil: 'domcontentloaded' });
      
      // Look for the initial Apply button
      const applyButton = page.locator('button:has-text("Apply with Indeed"), button:has-text("Apply now")').first();
      
      try {
        await applyButton.waitFor({ state: 'visible', timeout: 5000 });
        console.log("Found 'Apply' button. Clicking...");
        await applyButton.click();
        
        // Wait for the modal/application page to open
        await page.waitForTimeout(3000);
        console.log("Entering application flow...");

        let applicationDone = false;
        
        // Loop through up to 20 pages of the application
        for (let step = 0; step < 20; step++) {
          console.log(`Waiting for Step ${step + 1} to load...`);
          // 4-second wait to allow React to render the next screen
          await page.waitForTimeout(4000); 

          // 1. Check if we reached any "Submit" button (never auto-click submit)
          const submitBtn = page.getByRole('button', { name: /submit/i }).first();
          if (await submitBtn.isVisible()) {
            console.log("\n*** FINAL REVIEW STAGE ***");
            console.log("The script has reached the final step and paused.");
            console.log("Please review your information in the browser window.");
            console.log("You can manually click the Submit button, or close the window.");
            
            await new Promise((resolve) => {
              rl.question('\nPress ENTER in this terminal when you are done...', resolve);
            });

            applicationDone = true;
            break;
          }

          // 2. Broaden the "Continue" check to catch variations like "Next" or "Review your details"
          const continueBtn = page.getByRole('button', { name: /continue|next|review/i }).filter({ hasNotText: /submit/i }).first();
          if (await continueBtn.isVisible()) {
            const btnText = await continueBtn.innerText();
            console.log(`Step ${step + 1}: Found '${btnText.trim()}' button. Clicking...`);
            // force: true bypasses invisible loading overlays that might block the click
            await continueBtn.click({ force: true });

            // After clicking continue, check if it's still visible after a short delay
            // (meaning we didn't advance, likely due to a required field)
            await page.waitForTimeout(2000);
            if (await continueBtn.isVisible()) {
              console.log("\n*** PAUSED: REQUIRED FIELD MISSING ***");
              console.log("The page did not advance after clicking continue.");
              console.log("Please fill in the required fields manually in the browser.");
              await new Promise((resolve) => {
                rl.question('\nPress ENTER in this terminal when you have filled the fields and want the script to continue...', resolve);
              });

              // We decrement step so we retry this same page
              step--;
              continue;
            }

            continue; 
          }

          // 3. Check for the "Return to job search" button (appears if already applied)
          const returnBtn = page.getByRole('button', { name: /return to job search/i }).first();
          if (await returnBtn.isVisible()) {
            console.log("Already applied to this job.");
            applicationDone = true;
            break;
          }

          // If we reach here, no standard navigation buttons were found
          console.log("\n*** AUTOMATION STUCK ON DYNAMIC QUESTION ***");
          console.log("No continue/submit button found. Please navigate manually.");
          await new Promise((resolve) => {
            rl.question('\nPress ENTER in this terminal when you are done with this step...', resolve);
          });
          // Decrement step to check again
          step--;
          continue;
        }

        if (applicationDone) {
          console.log("Application flow handled!");
          job.status = 'submitted';
        } else {
          console.log("Please complete the remaining questions in the browser.");
          
          await new Promise((resolve) => {
            rl.question('\nPress ENTER in this terminal when you are done, or to cancel...', resolve);
          });
          
          job.status = 'manual_action_required';
        }

      } catch (timeoutError) {
        console.log("Could not find initial 'Apply' button within 5 seconds. It may be an external link.");
        job.status = 'failed';
      }

    } catch (error) {
      console.log(`Error navigating to job: ${error.message}`);
      job.status = 'failed';
    }

    // Save the final status for this job
    await writeDB(jobs);
    console.log(`Job marked as: ${job.status}`);

    // Break out of the loop after processing the specific job
    break;
  }

  console.log("\nAll jobs processed. Closing browser.");
  await browser.close();
  rl.close();
}

runAutoApply().catch(async (err) => {
  console.error("Fatal error:", err);
  rl.close();
});
