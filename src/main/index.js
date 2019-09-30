const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const H = require('./helpers.js');

const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow, splashWindow;

function createMainWindow() {

  
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  mainWindow.setMenu(null)
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.destroy();
      mainWindow.maximize();
      mainWindow.show();
      // H.clearstaticDir(staticPath);
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
    pathname: path.join(getStaticPath(), 'splash.html'),
    protocol: 'file',
    slashes: true
  }));
}

app.on('ready', () => {
  createMainWindow();
  createSplashWindow();
});

// Get excrept from an in-static txt (arg being the number of spaces)

ipcMain.on('reachForExcrept', (event, arg) => {
  let file = arg + '.txt';  
  fs.readFile(path.join(getStaticPath(), file), 'utf8', function (err, data) {
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
        let ast = path.join(getStaticPath(), np.base);
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

// Static path fix

function getStaticPath() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const staticPath = isDevelopment ? __static : __dirname.replace(/app\.asar$/, 'static');
    return staticPath;
};
