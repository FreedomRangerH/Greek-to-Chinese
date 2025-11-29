// src/utils/api.js
export async function getSyllables() {
  return await window.Electron.getSyllables();
}

export async function setSyllables(syllables) {
  return await window.Electron.setSyllables(syllables);
}

export async function getWords() {
  return await window.Electron.getWords();
}

export async function setWords(words) {
  return await window.Electron.setWords(words);
}
