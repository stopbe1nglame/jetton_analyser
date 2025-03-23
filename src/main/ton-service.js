const { TonApiClient } = require('@ton-api/client');
const { Address } = require('@ton/core');
const fs = require('fs');



const ta = new TonApiClient({
    baseUrl: 'https://tonapi.io',
    apiKey: process.env.TON_API_KEY
});




async function getAccountInfo(address) {
    try {
        let wallet_address = Address.parse(address);
        let account = await ta.accounts.getAccount(wallet_address);

        account['balance'] = Number(account['balance']) / 1000000000;
        account["address"] = `${wallet_address}`;

        let currentMarketPrice = await ta.rates.getMarketsRates();
        let price = currentMarketPrice.markets[0].usdPrice;
        console.log(price);

        const text = `⚡️ Address: ${account["address"]}\n\n💸 Balance: ${account["balance"]} TON/ $${(account["balance"] * price).toFixed(2)}\n\n🟢 Status: ${account["status"]}\n\n💠 Interface: ${account["interfaces"]}\n\n⁉️ Is it wallet?: ${account["isWallet"]}`;
        account = JSON.stringify(account, null, 2);
        return [account, text];

    } catch (error) {
        console.error('Error in getAccountInfo:', error);
        return [`Error: ${error.message}`, `Error: ${error.message}`];
    }
}


async function getJettonData(address) {
    try {
        let jetton_address = Address.parse(address);
        let jetton = await ta.jettons.getJettonInfo(jetton_address);

        jetton["totalSupply"] = Number(jetton["totalSupply"]) / (10 ** parseInt(jetton["metadata"]["decimals"]));
        // fs.writeFileSync('jetton.json', JSON.stringify(jetton.admin.address, null, 2));
        
        const jettonCopy = { ...jetton};

        // delete jettonCopy.admin;

        // console.log(`Address: ${jetton["admin"]["address"]}\n\nName: ${jetton["admin"]["name"] ? jetton["name"] : "Unknown"}\n\nScam: ${jetton["admin"]["isScam"]}\n\nWallet: ${jetton["admin"]["isWallet"]}`)

        const text_dev = `Address: ${jetton["admin"]["address"]}\n\nName: ${jetton["admin"]["name"] ? jetton["name"] : "Unknown"}\n\nScam: ${jetton["admin"]["isScam"]}\n\nWallet: ${jetton["admin"]["isWallet"]}`;
        const text_jetton = `Address: ${jetton["metadata"]["address"]}\n\nSupply: ${jetton["totalSupply"]}\n\nName: ${jetton["metadata"]["name"]}\n\nSymbol: ${jetton["metadata"]["symbol"]}\n\nImage URL: ${jetton["metadata"]["image"]}\n\nDescription: ${jetton["metadata"]["description"]}\n\nWebsite: ${jetton["metadata"]["websites"]}\n\nSocials: ${jetton["metadata"]["social"]}\n\nHolders: ${jetton["holdersCount"]}\n\nVerification: ${jetton["verification"]}`;
        delete jettonCopy.admin;
        const json_dev = JSON.stringify(jetton["admin"], null, 2);
        const json_jetton = JSON.stringify(jettonCopy, null, 2);

        return [text_dev, text_jetton, json_dev, json_jetton];
    } catch (error) {
        console.error('Error in getJettonInfo:', error);
        return [`Error: ${error.message}`, `Error: ${error.message}`];
    }
}

// function hashToAddress(address) {
//     const hashBuffer = Buffer.from(address.hash.data);
//     const address_new = new Address(address.workChain, hashBuffer);
//     const addressString = address_new.toString();
//     console.log(addressString);
// }

module.exports = { getAccountInfo, getJettonData };



// const accountInfo = await getAccountInfo("your_address_to_test");
// console.log(`JSON: ${accountInfo[0]}`);
// console.log(`Text: ${accountInfo[1]}`);