var bip39 = require('bip39')
const fs = require('fs').promises
const {readFileSync} = require('fs');
const puppeteer = require('puppeteer')
const walletAddress = "14kqUazxibd8GSdw7QaApNVGTz62nNWdQacuPgbF8FGwBQP" // PUT WALLET ADDRESS HERE

function checkIfContainsSync(str) {
    const contents = readFileSync("attempts.txt", 'utf-8');
    const result = contents.includes(str);
    return result;
  }

async function accessWebsite() {
    var found = false
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://polkadot.js.org/apps/#/accounts')
    await page.screenshot({path:"screenshot.png"})
    while (!found){
        //mnemonic = generateNewMnemonic()
        do{
        mnemonic = bip39.generateMnemonic()
        }while(checkIfContainsSync(mnemonic))
        await page.waitForSelector('#root > div.apps--Wrapper.theme--light.Apps-sc-1153uyw-0.hXzRlG > div.Content-sc-1lmz432-0.eLWBLy > main > div.Accounts-sc-mp0ofd-0.kiegNm > div:nth-child(3) > div > button:nth-child(1)')
        await page.click('#root > div.apps--Wrapper.theme--light.Apps-sc-1153uyw-0.hXzRlG > div.Content-sc-1lmz432-0.eLWBLy > main > div.Accounts-sc-mp0ofd-0.kiegNm > div:nth-child(3) > div > button:nth-child(1)')
        await page.$eval('body > div.theme--light.ui--Modal.Base-sc-190q8hp-0.cZmPFb.Create-sc-j2eorn-0.dRxZOZ.size-large > div.ui--Modal__body > div.Content-sc-1yxi1dg-0.hWVvEv.ui--Modal__Content > div:nth-child(2) > div:nth-child(1) > div > div > div > textarea', (el) => el.value = "")
        await page.focus('body > div.theme--light.ui--Modal.Base-sc-190q8hp-0.cZmPFb.Create-sc-j2eorn-0.dRxZOZ.size-large > div.ui--Modal__body > div.Content-sc-1yxi1dg-0.hWVvEv.ui--Modal__Content > div:nth-child(2) > div:nth-child(1) > div > div > div > textarea')
        await page.keyboard.type(mnemonic)
        const f = await page.$('body > div.theme--light.ui--Modal.Base-sc-190q8hp-0.cZmPFb.Create-sc-j2eorn-0.dRxZOZ.size-large > div.ui--Modal__body > div.Content-sc-1yxi1dg-0.hWVvEv.ui--Modal__Content > div:nth-child(1) > div > div > div.ui--Row-base > div.ui--Row-details > div.ui--Row-address')
        const generatedAddress = await (await f.getProperty('textContent')).jsonValue()
        if (generatedAddress === walletAddress){
            await fs.writeFile("result.txt", mnemonic)
            found = true
        } else {
            await fs.appendFile("attempts.txt", mnemonic+"\n")
        } 
    } 
    await browser.close()
    console.log('Found! Check result.txt for Mnemonic')
}

accessWebsite()
