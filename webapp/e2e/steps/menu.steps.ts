// import { defineFeature, loadFeature } from "jest-cucumber";
// import puppeteer from "puppeteer";
//
// const feature = loadFeature('./features/menu.feature');
//
// let page: puppeteer.Page;
// let browser: puppeteer.Browser;
//
// defineFeature(feature, test => {
//
//     beforeAll(async () => {
//         browser = process.env.GITHUB_ACTIONS
//             ? await puppeteer.launch()
//             : await puppeteer.launch({ headless: false, slowMo: 100, args: ['--incognito'] });
//         page = await browser.newPage();
//
//         await page
//             .goto("http://localhost:3000", {
//                 waitUntil: "networkidle0",
//             })
//             .catch(() => {});
//         jest.setTimeout(100000);
//     });
//
//     test("User opens the menu",({given,when,then}) => {
//         jest.setTimeout(100000);
//         given("The user logs in", async () => {
//             await expect(page).toClick("span", {text:"Inrupt"});
//             await expect(page).toClick("button", {text:"Login"});
//
//             await page.waitForNavigation(); // wait for the login page to load
//
//             await page.type('#username', "pruebaLomap")
//             await page.type('#password', "passwordLomap")
//
//             await page.click('#login')
//
//             await page.waitForNavigation(); // wait for the redirect
//             await expect(page).toClick("button", {text:"Close"});
//             await page.waitForTimeout(8000);
//
//         });
//
//         when("The user clicks the menu", async () => {
//             const [menu] = await page.$x('/html/body/div[1]/div/div[2]/div');
//             await menu.click();
//         });
//
//         then("All options are displayed", async () => {
//             await page.waitForTimeout(3000); // wait for 10 seconds
//             await expect(page).toMatch('Map View')
//             await expect(page).toMatch('List of Locations')
//             await expect(page).toMatch('Add Location')
//             await expect(page).toMatch('Add Friends')
//             await expect(page).toMatch('Progress')
//             await expect(page).toMatch('Profile')
//         });
//
//     })
//
//     afterAll(async ()=>{
//
//     })
//
// });