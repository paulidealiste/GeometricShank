const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const H = require('./main/helpers.js')

let isDevelopment = process.env.APP_MODE === 'development';
try {
  require('dotenv').config();
} catch (error) {
  isDevelopment = false;
}

let mainWindow, splashWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  mainWindow.setMenu(null)
  if (isDevelopment) {
    mainWindow.loadURL(`http://${process.env.DEV_SERVER}:${process.env.DEV_PORT}`)
  } else {
    mainWindow.loadFile('dist/index.html');
  }
  
  if (isDevelopment) {
  }
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  });

  setTimeout(() => {
    splashWindow.destroy();
    mainWindow.maximize();
    mainWindow.show();
  }, 5000);

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
  splashWindow.loadFile(path.join(getStaticPath(), 'splash.html'));
}

app.on('ready', () => {
  createMainWindow();
  createSplashWindow();
});

// Get excrept from an in-static txt (arg being the number of spaces)

ipcMain.on('reachForExcrept', (event, arg) => {
  let file = arg + '.txt';  
  fs.readFile(path.join(getStaticPath(), file), 'utf8', function (err, data) {
    if (err) {
      event.sender.send('mainProcessError', err.message);
      return;
    }
    let ri = H.randomIndices(data);
    event.sender.send('excreptReached', data.substring(ri[0], ri[1]));
  });
});

// Upload the requested file

ipcMain.on('openAndStoreFile', (event, arg) => {
  dialog.showOpenDialog({
    filters: [
      { name: 'text', extensions: ['txt'] }
    ]
  }).then(result => {
    if (result.filePaths != null && !result.canceled) {
      let np = path.parse(result.filePaths[0]);
      fs.readFile(result.filePaths[0], (err, data) => {
        if (err) { 
          event.sender.send('mainProcessError', err.message);
          return;
        }
        let ast = path.join(getStaticPath(), np.base);
        fs.writeFile(ast, data, 'utf-8', (err) => {
          if (err) {
            event.sender.send('mainProcessError', err.message);
            return;
          }
          event.sender.send('newVictimFileStored', np.name);
        })
      })
    }
  }).catch(err => {
    event.sender.send('mainProcessError', err.message);
  })
});

// Printing the cutup contents

ipcMain.on('printToto', (event, arg) => {
  dialog.showSaveDialog({
    filters: [
      { name: 'text', extensions: ['txt'] }
    ]
  }).then(result => {
    console.log(result)
    if (result.filePath != null && !result.canceled) {
      let saveBuf = fs.createWriteStream(result.filePath, {
        flags: 'a',
        encoding: 'utf8'
      });
      for (let i = 0; i < arg.length; i++) {
        let line = arg[i] + '\r\n';
        saveBuf.write(line);
      }
      saveBuf.end();
      saveBuf.on('finish', () => {
        event.sender.send('totoPrinted', result.filePath);
      });
    } else {
      event.sender.send('mainProcessError', 'totoNotPrinted');
    }
  });
});

// Static path fix

function getStaticPath() {
    const isDevelopment = process.env.APP_MODE === 'development';
    const staticPath = isDevelopment ? 'static' : __dirname.replace(/app\.asar$/, 'static');
    return 'static';
};
