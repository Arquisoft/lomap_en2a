import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/profile.feature');

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, test => {

    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch()
            : await puppeteer.launch({ headless: false, slowMo: 100, args: ['--incognito'] });
        page = await browser.newPage();

        await page
            .goto("http://localhost:3000", {
                waitUntil: "networkidle0",
            })
            .catch(() => {});
        jest.setTimeout(100000);
    });

    test("User checks its profile information",({given,when,then}) => {
        jest.setTimeout(100000);
        given("The user logs in", async () => {
            await expect(page).toClick("span", {text:"Inrupt"});
            await expect(page).toClick("button", {text:"Login"});

            await page.waitForNavigation(); // wait for the login page to load

            await page.type('#username', "pruebaLomap")
            await page.type('#password', "passwordLomap")

            await page.click('#login')

            await page.waitForNavigation(); // wait for the redirect
            await page.waitForTimeout(15000); 
            await expect(page).toClick("button", {text:"Close"});
            await page.waitForTimeout(8000);

            const [menu] = await page.$x('//*[@id="smallContainer"]');
            await menu.click();
            await page.waitForTimeout(3000)
        });

        when("The user clicks the Profile button", async () => {
            const [profile] = await page.$x('/html/body/div[1]/div/div[3]/div/div[7]/button')
            await profile.click();
            await page.waitForTimeout(3000); // wait for 10 seconds

        });

        then("The profile is shown", async () => {
            await expect(page).toMatch('Profile Information')
        });

    })

    afterAll(async ()=>{
        browser.close()
    })

});