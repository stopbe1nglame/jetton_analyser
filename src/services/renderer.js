// import { ipcRenderer } from 'electron';
// const { getAccountInfo } = require('./src/main/ton-service.js');

let isJsonFormat = false;

let walletCache = {};
let jettonCache = {};

document.getElementById('check').addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const resultTextCont = document.getElementById('result-cont');
    const resultTextarea = document.getElementById('result');
    const jettonMessage = document.getElementById('jetton-message');
    const resultDev = document.getElementById('result_dev');
    const resultJetton = document.getElementById('result_jetton');
    const resultContainerDev = document.getElementById('dev-container');
    const resultContainerJetton = document.getElementById('jetton-container');
    
    jettonMessage.classList.add('hidden');
    resultDev.classList.add('hidden');
    resultJetton.classList.add('hidden');
    resultContainerDev.classList.add('hidden');
    resultContainerJetton.classList.add('hidden');
    resultTextarea.classList.remove("hidden");
    resultTextCont.classList.remove("hidden");

    resultTextarea.value = 'Loading...';

    try {
        const walletInfo = await window.electronAPI.getAccountInfo(address);
        walletCache[address] = walletInfo;
        resultTextarea.value = isJsonFormat ? walletInfo[0] : walletInfo[1];
        const walletInfoParsed = JSON.parse(walletInfo[0]);
        console.log(walletInfoParsed.interfaces);
        if (walletInfoParsed.interfaces.includes('jetton_master')) {
            console.log('Jetton wallet detected!');
            jettonMessage.classList.remove('hidden');
        }
        // if (walletInfo["interfaces"] && walletInfo.interfaces.includes[0] === 'jetton_master') {
        //     jettonMessage.classList.remove('hidden');
        //     console.log('Jetton wallet detected!');
        // }

    } catch (error) {
        resultTextarea.value = `Error: ${error.message}`;
    }
});


document.getElementById('jetton-info').addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const resultTextCont = document.getElementById('result-cont');
    const resultTextarea = document.getElementById('result');
    const jettonMessage = document.getElementById('jetton-message');
    const resultDev = document.getElementById('result_dev');
    const resultJetton = document.getElementById('result_jetton');
    const resultContainerDev = document.getElementById('dev-container');
    const resultContainerJetton = document.getElementById('jetton-container');
    
    jettonMessage.classList.add("hidden");
    resultTextarea.classList.add("hidden");
    resultTextCont.classList.add("hidden");
    resultContainerDev.classList.remove("hidden");
    resultContainerJetton.classList.remove("hidden");
    resultJetton.classList.remove("hidden");
    resultDev.classList.remove("hidden");

    resultDev.value = 'Loading...';
    resultJetton.value = 'Loading...';

    try {
        const jettonInfo = await window.electronAPI.getJettonData(address);
        jettonCache[address] = jettonInfo;
        jettonInfo[2]
        resultDev.value = isJsonFormat ? [jettonInfo[2]] : [jettonInfo[0]];
        resultJetton.value = isJsonFormat ? [jettonInfo[3]] : [jettonInfo[1]];
    } catch (error) {
        resultTextarea.value = `Error: ${error.message}`;
    }
});


document.getElementById('toggle-format').addEventListener('click', () => {
    const address = document.getElementById('address').value;
    const resultTextarea = document.getElementById('result');
    const resultDev = document.getElementById('result_dev');
    const resultJetton = document.getElementById('result_jetton');
    const toggleButton = document.getElementById('toggle-format');

    isJsonFormat = !isJsonFormat;

    if (isJsonFormat) {
        toggleButton.textContent = 'Switch to User-Friendly';
        resultTextarea.value = walletCache[address][0];
        resultDev.value = jettonCache[address][2];
        resultJetton.value = jettonCache[address][3];
    } else {
        toggleButton.textContent = 'Switch to JSON';
        resultTextarea.value = walletCache[address][1];
        resultDev.value = jettonCache[address][0];
        resultJetton.value = jettonCache[address][1];
    }
});


document.getElementById('copy').addEventListener('click', () => {
    const resultTextarea = document.getElementById('result');
    resultTextarea.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});

document.getElementById('copy-dev').addEventListener('click', () => {
    const resultTextarea = document.getElementById('result_dev');
    resultTextarea.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});

document.getElementById('copy-jetton').addEventListener('click', () => {
    const resultTextarea = document.getElementById('result_jetton');
    resultTextarea.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
});

document.getElementById('download').addEventListener('click', () => {
    const address = document.getElementById('address').value;
    const resultTextarea = document.getElementById('result');

    const jsonData = walletCache[address][0];

    if (!jsonData || jsonData === 'Loading...' || jsonData.startsWith('Error:')) {
        alert('No valid JSON data to download.');
        return;
    }

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet-info.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});