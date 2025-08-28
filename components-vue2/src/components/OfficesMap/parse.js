const { writeFileSync } = require("fs");
const { join } = require("path");

const playwright = require("playwright");
const axios = require("axios");

async function main() {
  const browser = await playwright.chromium.launch({
    headless: false,
    devtools: true,
  });
  const page = await browser.newPage({
    bypassCSP: true,
    viewport: {
      height: 900,
      width: 1200,
    },
  });
  await page.goto("https://egaxegax.github.io/dbcartajs/svg/mosmetro.html");
  await page.waitForTimeout(5000);
  const filename = join(__dirname, "mosmetro.svg");
  const { data } = await axios.get(`https://mobile.reso.ru/free/v2/agencies/77?lat=55.7540471&long=37.62040&dfdsf`);

  await page.evaluate((agencies) => {
    window.agencies = agencies;
  }, data);

  const svg = await page.evaluate(() => {
    const g = document.querySelector("svg g");
    const offices = new Set();
    const use = document.createElement("use");

    for (let i = 0; i < g.children.length; i++) {
      let name = g.children[i].innerHTML;
      agencies.forEach((office) => {
        office.IDUNDERGROUND.forEach((item) => {
          name = name.toLowerCase().replace("ё", "е");
          if (item.SNAME.toLowerCase() === name) {
            const x = g.children[i - 1].getAttribute("cx");
            const y = g.children[i - 1].getAttribute("cy");

            use.setAttribute("x", x - 12);
            use.setAttribute("y", y - 12);
            use.setAttribute("href", "#balloon-open");
            use.setAttribute("data-station", `${g.children[i].innerHTML}`);
            offices.add(use.outerHTML);
          }
        });
      });
    }
    for (const use of offices) {
      g.insertAdjacentHTML("beforeend", `${use}`);
    }
    document.body.querySelector("#mcol>div>svg ").removeAttribute("transform");
    document.body.querySelector("#mcol>div>svg g").classList.add("g-svg-metromap");
    document.body.querySelector("#mcol>div>svg g").removeAttribute("transform");
    document.body.querySelector("#mcol>div>svg").classList.add("svg-metromap");
    //      document.body.querySelector("#mcol>div>svg>path").remove();
    return document.body.querySelector("#mcol>div>svg").outerHTML;
  });
  writeFileSync(filename, svg);
  await page.waitForTimeout(10000);
  // await browser.close();
}

main();
