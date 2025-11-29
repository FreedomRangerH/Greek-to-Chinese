// electron/fileService.cjs

const { app } = require("electron");
const { join, dirname } = require("path");
const { existsSync, writeFileSync, readFileSync, mkdirSync } = require("fs");

let basePath;

if (app.isPackaged) {
  basePath = dirname(app.getPath("exe"));
} else {
  basePath = process.cwd();
}

const dataDir = join(basePath, "data");
const syllablePath = join(dataDir, "syllable_map.json");
const wordPath = join(dataDir, "word_map.json");

if (!existsSync(dataDir)) {
  try {
    console.log(`正在创建数据目录: ${dataDir}`);
    mkdirSync(dataDir, { recursive: true });
  } catch (err) {
    console.error("创建数据目录失败:", err);
  }
}

// 读取音节表
function getSyllables() {
  try {
    if (!existsSync(syllablePath)) {
      writeFileSync(syllablePath, JSON.stringify({}), "utf-8");
    }
    const content = readFileSync(syllablePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("读取 syllable_map.json 失败：", err);
    return {};
  }
}

// 保存音节表
function setSyllables(syllables) {
  try {
    writeFileSync(syllablePath, JSON.stringify(syllables), "utf-8");
    return true;
  } catch (err) {
    console.error("写入 syllable_map.json 失败：", err);
    return false;
  }
}

// 读取单词表
function getWords() {
  try {
    if (!existsSync(wordPath)) {
      writeFileSync(wordPath, JSON.stringify({}), "utf-8");
    }
    const content = readFileSync(wordPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("读取 word_map.json 失败：", err);
    return {};
  }
}

// 保存单词表
function setWords(words) {
  try {
    writeFileSync(wordPath, JSON.stringify(words), "utf-8");
    return true;
  } catch (err) {
    console.error("写入 word_map.json 失败：", err);
    return false;
  }
}

module.exports = { getSyllables, setSyllables, getWords, setWords };
