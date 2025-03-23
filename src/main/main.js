const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getAccountInfo, getJettonData } = require('./ton-service.js');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 900,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'services', 'index.html'));
});

// wallet information
ipcMain.handle('get-wallet-info', async (event, address) => {
    try {
        console.log(`Fetching wallet info for: ${address}`);
        const walletInfo = await getAccountInfo(address);
        return walletInfo;
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        return `Error: ${error.message}`;
    }
});

// jetton information
ipcMain.handle('get-jetton-info', async (event, address) => {
    try {
        console.log(`Fetching jetton info for: ${address}`);
        const jettonInfo = await getJettonData(address);
        return jettonInfo;
    } catch (error) {
        console.error('Error fetching jetton info:', error);
        return `Error: ${error.message}`;
    }
});
