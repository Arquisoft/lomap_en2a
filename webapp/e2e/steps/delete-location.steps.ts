import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/delete-location.feature');

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

    test("A user deletes a location",({given,when,and,then}) => {
        jest.setTimeout(100000);
        given("The user logs in", async () => {
            await expect(page).toClick("span", {text:"Inrupt"});
            await expect(page).toClick("button", {text:"Login"});
            
            await page.waitForNavigation(); // wait for the login page to load

            await page.type('#username', "pruebaLomap")
            await page.type('#password', "passwordLomap")

            await page.click('#login')

            await page.waitForNavigation(); // wait for the redirect
            await page.waitForTimeout(30000); // wait for 25 seconds (load locations??)
            
        });

        and("goes to the list of locations", async () => {
            const [menu] = await page.$x('/html/body/div[1]/div/div[2]/div');
            await menu.click();
            
            const [list] = await page.$x('/html/body/div[1]/div/div[2]/div/div[2]/button')
            await list.click();
            await page.waitForTimeout(3000)
        })
        
        and("selects a location", async () => {
            const [location] = await page.$x('/html/body/div[1]/div/div[2]/div/div[1]/div');
            await location.click();
            await page.waitForTimeout(3000)
        })

        when("The user clicks the delete location button", async () => {
            const [deleteButton] = await page.$x('/html/body/div[1]/div/div[2]/div[2]/div/button[1]'); // delete button
            await deleteButton.click();
            await page.waitForTimeout(2000)
            

            const [confirmation] = await page.$x('/html/body/div[3]/div/div[3]/div/section/footer/button[2]'); // confirmation button
            await confirmation.click();
            

        });

        then("A confirmation of deletion message is shown in the screen", async () => {
            await page.waitForTimeout(22000); // wait for 10 seconds
            await expect(page).toMatch('Location deleted.')
        });

    })

    afterAll(async ()=>{

    })

});