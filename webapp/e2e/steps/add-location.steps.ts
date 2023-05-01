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
        jest.setTimeout(100000);
    });

    test("The user is registered in the site",({given,when,then}) => {
        jest.setTimeout(100000);
        given("A registered user goes to the Add Location form", async () => {
            await expect(page).toClick("span", {text:"Inrupt"});
            await expect(page).toClick("button", {text:"Login"});

            await page.waitForNavigation(); // wait for the login page to load

            await page.type('#username', "pruebaLomap")
            await page.type('#password', "passwordLomap")

            await page.click('#login')

            await page.waitForNavigation(); // wait for the redirect
            // await page.waitForTimeout(30000); // wait for 25 seconds (load locations??)
            await expect(page).toClick("button", {text:"Close"});

            await page.waitForTimeout(8000);

            const [menu] = await page.$x('//*[@id="smallContainer"]');
            await menu.click();

            const [add] = await page.$x('/html/body/div[1]/div/div[3]/div/div[3]/button')
            await add.click();
            await page.waitForTimeout(3000)
        });

        when("I fill the data in the form and press submit", async () => {
            const [name] = await page.$x('/html/body/div[1]/div/form/div/div[2]/input');
            name.type('New York')
            await page.waitForTimeout(2000);

            const [editManually] = await page.$x('/html/body/div[1]/div/form/div/div[3]/div[1]/button');
            editManually.click();
            await page.waitForTimeout(2000);

            const [coordinates] = await page.$x('/html/body/div[1]/div/form/div/div[3]/input');
            coordinates.type('33,33')
            await page.waitForTimeout(3000);

            const [description] = await page.$x('/html/body/div[1]/div/form/div/div[4]/textarea');
            description.type('Description')
            await page.waitForTimeout(3000);

            const [submit] = await page.$x('/html/body/div[1]/div/form/div/div[6]/button');
            submit.click()

        });

        then("A confirmation message should be shown in the screen", async () => {
            await page.waitForTimeout(7000); // wait for 10 seconds
            await expect(page).toMatch('Location correctly added to your pod')
        });

    })

    afterAll(async ()=>{

    })

});