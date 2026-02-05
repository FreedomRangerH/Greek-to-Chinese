import { defineStore } from "pinia";
import { getSyllables, setSyllables, getWords, setWords } from "./utils/api";

export const useDataStore = defineStore("data", {
  state: () => ({
    syllableToPronounce: new Map(),
    wordToSyllables: new Map(),
    syllableToWords: new Map(),
  }),

  getters: {
    getPronunce: (state) => (syllable) =>
      state.syllableToPronounce.get(syllable),
    getSyllables: (state) => (word) => state.wordToSyllables.get(word),
    getWords: (state) => (syllable) => {
      const set = state.syllableToWords.get(syllable);
      return set
        ? Array.from(set).sort((a, b) => a[0].localeCompare(b[0]))
        : [];
    },
    getAllSyllables: (state) => {
      const list = Array.from(state.syllableToPronounce.entries());
      return list.sort((a, b) => a[0].localeCompare(b[0]));
    },
    getAllWords: (state) => {
      const list = Array.from(state.wordToSyllables.entries());
      return list.sort((a, b) => a[0].localeCompare(b[0]));
    },
  },

  actions: {
    async addSyllable(syllable, pronunce) {
      this.syllableToPronounce.set(syllable, pronunce);
      // 保存音节和发音
      const syllablesObj = Object.fromEntries(this.syllableToPronounce);
      await setSyllables(syllablesObj);
    },

    async addWord(word, syllables) {
      syllables = [...syllables];
      // 如果单词已存在，先移除旧的映射
      if (this.wordToSyllables.has(word)) {
        const oldSyllables = this.wordToSyllables.get(word);
        oldSyllables.forEach((syllable) => {
          const set = this.syllableToWords.get(syllable);
          if (set) {
            set.delete(word);
            if (set.size === 0) {
              this.syllableToWords.delete(syllable);
              this.syllableToPronounce.delete(syllable);
            }
          }
        });
      }
      this.wordToSyllables.set(word, syllables);
      syllables.forEach((syllable) => {
        let set = this.syllableToWords.get(syllable);
        if (!set) {
          set = new Set();
          this.syllableToWords.set(syllable, set);
        }
        set.add(word);
      });
      // 保存单词和音节
      const wordsObj = Object.fromEntries(this.wordToSyllables);
      await setWords(JSON.parse(JSON.stringify(wordsObj)));
    },

    async removeWord(word) {
      const syllables = this.wordToSyllables.get(word);
      let syllableChanged = false;
      if (syllables) {
        syllables.forEach((syllable) => {
          const set = this.syllableToWords.get(syllable);
          if (set) {
            set.delete(word);
            if (set.size === 0) {
              this.syllableToWords.delete(syllable);
              this.syllableToPronounce.delete(syllable);
              syllableChanged = true;
            }
          }
        });
      }
      this.wordToSyllables.delete(word);
      // 保存单词和音节
      const wordsObj = Object.fromEntries(this.wordToSyllables);
      await setWords(JSON.parse(JSON.stringify(wordsObj)));
      if (syllableChanged) {
        // 保存音节和发音
        const syllablesObj = Object.fromEntries(this.syllableToPronounce);
        await setSyllables(syllablesObj);
      }
    },

    async loadAll() {
      // 加载音节和发音
      const syllables = await getSyllables();
      if (syllables && typeof syllables === "object") {
        this.syllableToPronounce = new Map(Object.entries(syllables));
      }
      // 加载单词和音节
      const words = await getWords();
      if (words && typeof words === "object") {
        this.wordToSyllables = new Map(Object.entries(words));
        // 反向建立 syllableToWords
        this.syllableToWords = new Map();
        for (const [word, syllArr] of Object.entries(words)) {
          syllArr.forEach((syllable) => {
            let set = this.syllableToWords.get(syllable);
            if (!set) {
              set = new Set();
              this.syllableToWords.set(syllable, set);
            }
            set.add(word);
          });
        }
      }
    },
  },
});
