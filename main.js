const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const H = require('./helpers.js');


let mainWindow, splashWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.destroy();
      mainWindow.show();
      H.clearAssetsDir(assetsPath);
    }, 5000);
  })
}

// Splash screen controls

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 680,
    height: 380,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    show: true,
    resizable: false
  });

  splashWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file',
    slashes: true
  }));
}

app.on('ready', () => {
  createMainWindow();
  createSplashWindow();
});

// Get excrept from an in-assets txt (arg being the number of spaces)

const assetsPath = path.join(__dirname, '/assets/');

ipcMain.on('reachForExcrept', (event, arg) => {
  fs.readFile(assetsPath + arg + '.txt', 'utf8', function (err, data) {
    if (err) throw err;
    let ri = H.randomIndices(data);
    event.sender.send('excreptReached', data.substr(ri[0], ri[1] - ri[0]));
  });
});

// Upload the requested file

ipcMain.on('openAndStoreFile', (event, arg) => {
  dialog.showOpenDialog({
    filters: [
      { name: 'text', extensions: ['txt'] }
    ]
  }, (pathToFile) => {
    if (pathToFile) {
      let np = path.parse(pathToFile[0]);
      fs.readFile(pathToFile[0], (err, data) => {
        if (err) throw err;
        let ast = assetsPath + np.base;
        fs.writeFile(ast, data, 'utf-8', (err) => {
          if (err) throw err;
          event.sender.send('newVictimFileStored', np.name);
        });
      })
    }
  })
});

// Printing the cutup contents

ipcMain.on('printToto', (event, arg) => {
  dialog.showSaveDialog({
    filters: [
      { name: 'text', extensions: ['txt'] }
    ]
  }, (fullPath) => {
    if (fullPath) {
      let saveBuf = fs.createWriteStream(fullPath, {
        flags: 'a',
        encoding: 'utf8'
      });
      for (let i = 0; i < arg.length; i++) {
        let line = arg[i] + '\r\n';
        saveBuf.write(line);
      }
      saveBuf.end();
      saveBuf.on('finish', () => {
        event.sender.send('totoPrinted', fullPath);
      });
    } else {
      event.sender.send('totoNotPrinted');
    }
  });
});

