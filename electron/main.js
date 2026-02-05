// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const fileService = require('./fileService.cjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200, height: 1000,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('get-syllables', () => fileService.getSyllables());
  ipcMain.handle('set-syllables', (_, data) => fileService.setSyllables(data));
  
  ipcMain.handle('get-words', () => fileService.getWords());
  ipcMain.handle('set-words', (_, data) => fileService.setWords(data));
});

app.on('window-all-closed', () => app.quit());