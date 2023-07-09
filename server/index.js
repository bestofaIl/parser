const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function getDate() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    let nextButton;
    let publications = [];
    await page.goto("https://www.elibrary.ru/author_items.asp?authorid=622808");
    do {
        await page.waitForSelector("#restab > tbody > tr:nth-child(1)");
        await page.waitForSelector("#pages > table > tbody > tr > td:nth-child(10) > a", {timeout: 2000}).catch((e) => {
            console.log(e)
        });
        publications = publications.concat(await page.$$eval("#restab > tbody > tr", async (works) => {
            try {
                return works
                    .filter((work => work.id))
                    .map((work) => {
                        return (document.querySelector(`#${work.id} > td:nth-child(2) > a > b > span`) || document.querySelector(`#${work.id} > td:nth-child(2) > b`)).textContent;
                    })
            } catch (e) {
                console.log(e);
            }
        }))

        nextButton = await page.$("#pages > table > tbody > tr > td:nth-child(10) > a");

        if (nextButton) {
            await page.click("#pages > table > tbody > tr > td:nth-child(10) > a");
        }
    } while (nextButton);

    await fs.writeFile("data.txt", publications.join("\n"));
    await browser.close();

}

getDate();

// async function getFreeDate () {
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto("https://emias.info/");
//     await page.setViewport({width: 1000, height: 500});
//
//     await page.waitForSelector("#root > main > div > div.Yses3Q > div > div > div > div > form > div.yiMOEi > div > div > input")
//     // await page.click(".apQTGX");
//     const inputs = await page.$$("form div input");
//
//     const dataFromFrontend = {
//         policy: 7794799721001057,
//         day: "28",
//         month: "05",
//         year: "2002"
//     }
//
//     console.log(inputs[0].frame.name());
//     for (const input of inputs) {
//         // await input.type("1");
//         // await page.evaluate((el, data) => {
//         //     el.value = data[el.name];
//         // }, input, dataFromFrontend);
//     }
//
//     // await page.type(".P8KZKM", "7794799721001057", {
//     //     delay: 1000
//     // })
//     // await page.$$eval("input", (inputs) => {
//     //     inputs.forEach(input => {
//     //         await page.
//     //     })
//     // });
//     // console.log(inputs);
// }

// getFreeDate();



