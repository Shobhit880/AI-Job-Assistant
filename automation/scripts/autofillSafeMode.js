require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const targetUrl = process.env.TARGET_FORM_URL || "https://example.com/job-application";
const dataPath = path.join(__dirname, "sampleAutofillData.json");
const autofillData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

async function fillIfPresent(page, selectors, value) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      await locator.fill(value);
      return true;
    }
  }
  return false;
}

async function run() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Opening target form in safe mode:", targetUrl);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

  await fillIfPresent(page, ['input[name="name"]', 'input[name="fullName"]', '#name'], autofillData.name);
  await fillIfPresent(page, ['input[type="email"]', 'input[name="email"]', '#email'], autofillData.email);
  await fillIfPresent(page, ['input[type="tel"]', 'input[name="phone"]', '#phone'], autofillData.phone);
  await fillIfPresent(
    page,
    ['textarea[name="skills"]', 'textarea[name="keySkills"]', '#skills'],
    autofillData.skills.join(", ")
  );
  await fillIfPresent(
    page,
    ['textarea[name="experience"]', 'textarea[name="workExperience"]', '#experience'],
    autofillData.experience
      .map((item) => `${item.title} at ${item.company} (${item.startDate} - ${item.endDate})`)
      .join("\n")
  );
  await fillIfPresent(
    page,
    ['textarea[name="coverLetter"]', 'textarea[name="question_1"]', '#question_1'],
    autofillData.answers[0]
  );

  console.log("Form fields filled where selectors matched.");
  console.log("SAFE MODE: review the page manually. No submission will be triggered.");

  const submitCandidates = page.locator('button[type="submit"], input[type="submit"]');
  if (await submitCandidates.count()) {
    console.log("Submission controls detected and intentionally left untouched.");
  }

  await page.pause();
  await browser.close();
}

if (require.main === module) {
  run().catch((error) => {
    console.error("Autofill failed:", error);
    process.exit(1);
  });
}

module.exports = {
  run,
};
