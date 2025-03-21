const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getAccountInfo: (address) => ipcRenderer.invoke('get-wallet-info', address)
});
