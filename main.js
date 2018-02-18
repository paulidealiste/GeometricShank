const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const H = require('./helpers.js');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768
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
}

app.on('ready', createWindow)

// Get excrept from an in-assets txt (arg being the number of spaces)

ipcMain.on('reachForExcrept', (event, arg) => {
  fs.readFile('./src/assets/4280-0.txt', 'utf8', function(err, data) {
    if (err) throw err;
    let ri = H.randomIndices(data);
    event.sender.send('excreptReached', data.substr(ri[0], ri[1]));
  });
});
