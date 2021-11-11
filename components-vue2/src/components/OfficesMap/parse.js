const { writeFileSync } = require("fs");
const { join } = require("path");
const playwright = require("playwright");

async function main() {
  const browser = await playwright.chromium.launch({
    headless: false,
  });
  const page = await browser.newPage({
    bypassCSP: true,
  });
  await page.goto("https://egaxegax.github.io/dbcartajs/svg/mosmetro.html");
  await page.waitForTimeout(5000);
  // const html = await page.content();
  const filename = join(__dirname, "mosmetro.svg");
  let svg = await page.evaluate(
    () => document.body.querySelector("svg").outerHTML
  );
  writeFileSync(filename, svg);
  await page.waitForTimeout(10000);
  await browser.close();
}

main();
