import { defineFeature, loadFeature } from "jest-cucumber";
import puppeteer from "puppeteer";

const feature = loadFeature('./features/add-friend.feature');

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

    test("A user adds a new friend",({given,when,and,then}) => {
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
            await expect(page).toClick("button", {text:"Close"});

            await page.waitForTimeout(8000);

        });

        and("goes to Add a friend", async () => {
            const [menu] = await page.$x('//*[@id="smallContainer"]');
            await menu.click();
            await page.waitForTimeout(3000)

            const [friend] = await page.$x('/html/body/div[1]/div/div[3]/div/div[4]/button')
            await friend.click();
            await page.waitForTimeout(3000)
        })

        when("The user introduces a valid webId", async () => {
            const [webId] = await page.$x('/html/body/div[1]/div/div[3]/div/div[1]/input');
            webId.type('https://patrigarcia.solidcommunity.net/profile/card#me')
            await page.waitForTimeout(15000);

            const [addFriend] = await page.$x('/html/body/div[1]/div/div[3]/div/div[1]/button');
            addFriend.click()
            await page.waitForTimeout(11000)

        });

        then("The friend is added", async () => {
            const [friend] = await page.$x('/html/body/div[1]/div/div[3]/div/div[2]/div/div');
            await expect(page).toMatch('Patricia')
        });

    })

    afterAll(async ()=>{

    })

});