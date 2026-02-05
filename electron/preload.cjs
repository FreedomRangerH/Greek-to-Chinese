// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
  getSyllables: () => ipcRenderer.invoke('get-syllables'),
  setSyllables: (data) => ipcRenderer.invoke('set-syllables', data),
  getWords: () => ipcRenderer.invoke('get-words'),
  setWords: (data) => ipcRenderer.invoke('set-words', data)
});
