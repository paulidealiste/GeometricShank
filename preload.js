const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    'electron',
    {
        openAndStoreFile: () => ipcRenderer.send('openAndStoreFile'),
        newVictimFileStored: (callable) => ipcRenderer.on('newVictimFileStored', (_, args) => callable(args)),
        mainProcessError: (callable) => ipcRenderer.on('mainProcessError', (_, args) => callable(args)),
        reachForExcrept: (target) => ipcRenderer.send('reachForExcrept', target),
        excreptReached: (callable) => ipcRenderer.on('excreptReached', (_, args) => callable(args)),
        printToto: (toto) => ipcRenderer.send('printToto', toto),
        totoPrinted: (callable) => ipcRenderer.on('totoPrinted', (_, args) => callable(args))
    }
)