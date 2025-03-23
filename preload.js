const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getAccountInfo: (address) => ipcRenderer.invoke('get-wallet-info', address),
    getJettonData: (address) => ipcRenderer.invoke('get-jetton-info', address)
});


