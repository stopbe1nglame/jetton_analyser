// import { ipcRenderer } from 'electron';
// const { getAccountInfo } = require('./src/main/ton-service.js');

let isJsonFormat = false;

let walletCache = {};

document.getElementById('check').addEventListener('click', async () => {
    const address = document.getElementById('address').value;
    const resultTextarea = document.getElementById('result');

    resultTextarea.value = 'Loading...';

    try {
        const walletInfo = await window.electronAPI.getAccountInfo(address);
        walletCache[address] = walletInfo;
        resultTextarea.value = isJsonFormat ? walletInfo[0] : walletInfo[1];
    } catch (error) {
        resultTextarea.value = `Error: ${error.message}`;
    }
});

document.getElementById('toggle-format').addEventListener('click', () => {
    const address = document.getElementById('address').value;
    const resultTextarea = document.getElementById('result');
    const toggleButton = document.getElementById('toggle-format');

    isJsonFormat = !isJsonFormat;

    if (isJsonFormat) {
        toggleButton.textContent = 'Switch to User-Friendly';
        resultTextarea.value = walletCache[address][0];
    } else {
        toggleButton.textContent = 'Switch to JSON';
        resultTextarea.value = walletCache[address][1];
    }
});

document.getElementById('copy').addEventListener('click', () => {
    const resultTextarea = document.getElementById('result');
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