import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/add-location.feature');

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
    });

    test("The user is registered in the site",({given,when,then}) => {
        given("A registered user goes to the Add Location form", async () => {
            await expect(page).toClick("span", {text:"Inrupt"});
            await expect(page).toClick("button", {text:"Login"});


            
            let element = await page.waitForSelector('div[data-testid="smallContainer"]');
            // @ts-ignore
            await element.click();
            element = await page.waitForSelector('button[data-testid="Add location"]');
            // @ts-ignore
            await element.click();
        });

        when("I fill the data in the form and press submit", async () => {

        });

        then("A confirmation message should be shown in the screen", async () => {
            //await expect(page).toMatch('You have been registered in the system!')
        });

    })

    afterAll(async ()=>{

    })

});