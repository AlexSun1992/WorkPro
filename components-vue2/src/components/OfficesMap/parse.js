const { writeFileSync } = require("fs");
const { join } = require("path");

const playwright = require("playwright");
const axios = require("../../../node_modules/axios/lib/axios");

async function main() {
  const browser = await playwright.chromium.launch({
    headless: false,
    // devtools: true,
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
  const { data } = await axios.get(
    `https://mobile.reso.ru/free/v2/agencies/77?lat=55.7540471&long=37.62040&dfdsf`
  );
  let svg = await page.evaluate((agencies) => {
    let g = document.getElementsByTagName("g");

    let set = new Set();
    let use = document.createElement("use");

    for (let i = 0; i < g[0].children.length; i++) {
      let name = g[0].children[i].innerHTML;
      agencies.forEach((office) => {
        office.IDUNDERGROUND.forEach((item) => {
          name = name.toLowerCase().replace("ё", "е");
          if (item.SNAME.toLowerCase() === name) {
            let x = g[0].children[i - 1].getAttribute("cx");
            let y = g[0].children[i - 1].getAttribute("cy");

            use.setAttribute("x", x - 12);
            use.setAttribute("y", y - 12);
            use.setAttribute("href", "#balloon-open");
            use.setAttribute("data-station", `${g[0].children[i].innerHTML}`);
            set.add(use.outerHTML);
          }
        });
      });
    }
    for (let use of set) {
      g[0].insertAdjacentHTML("beforeend", `${use}`);
    }
    document.body.querySelector("svg").removeAttribute("transform");
    document.body.querySelector("svg g").classList.add("g-svg-metromap");
    document.body.querySelector("svg g").removeAttribute("transform");
    document.body.querySelector("svg").classList.add("svg-metromap");
    document.body.querySelector("svg>path").remove();
    return document.body.querySelector("svg").outerHTML;
  }, data);
  writeFileSync(filename, svg);
  await page.waitForTimeout(10000);
  // await browser.close();
}

main();
