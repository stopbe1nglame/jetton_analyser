const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getAccountInfo } = require('./ton-service.js');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'services', 'index.html'));
});

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