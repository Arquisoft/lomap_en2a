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
            // await page.waitForTimeout(30000); // wait for 25 seconds (load locations??)
            await page.waitForTimeout(8000);
            
            const [menu] = await page.$x('/html/body/div[1]/div/div[2]/div');
            await menu.click();
            
            const [add] = await page.$x('/html/body/div[1]/div/div[2]/div/div[3]/button')
            await add.click();
            await page.waitForTimeout(3000)
        });

        and("goes to the Add Location form", () => {

        })
        
        and("fills the form with data", () => {

        })

        when("The user clicks the delete location button", async () => {
            const [name] = await page.$x('/html/body/div[1]/div/form/div/div[2]/input');
            name.type('New York')
            await page.waitForTimeout(3000); 
            
            const [coordinates] = await page.$x('/html/body/div[1]/div/form/div/div[3]/input');
            coordinates.type('33,33')
            await page.waitForTimeout(3000); 

            const [description] = await page.$x('/html/body/div[1]/div/form/div/div[4]/textarea');
            description.type('Description')
            await page.waitForTimeout(3000); 

            const [submit] = await page.$x('/html/body/div[1]/div/form/div/div[6]/button');
            submit.click()

        });

        then("A confirmation of deletion message is shown in the screen", async () => {
            await page.waitForTimeout(7000); // wait for 10 seconds
            await expect(page).toMatch('Location added')
        });

    })

    afterAll(async ()=>{

    })

});