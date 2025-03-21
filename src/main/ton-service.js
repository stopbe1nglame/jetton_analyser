const { TonApiClient } = require('@ton-api/client');
const { Address } = require('@ton/core');
// import fs from 'fs';

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

        const text = `⚡️ Address: ${account["address"]}\n\n💸 Balance: ${account["balance"]} TON\n\n🟢 Status: ${account["status"]}\n\n💠 Interface: ${account["interfaces"]}\n\n⁉️ Is it wallet?: ${account["isWallet"]}`;
        account = JSON.stringify(account, null, 2);
        return [account, text];

    } catch (error) {
        console.error('Error in getAccountInfo:', error);
        return [`Error: ${error.message}`, `Error: ${error.message}`];
    }
}

module.exports = { getAccountInfo };

// const accountInfo = await getAccountInfo("your_address_to_test");
// console.log(`JSON: ${accountInfo[0]}`);
// console.log(`Text: ${accountInfo[1]}`);