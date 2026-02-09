// syllabify.js

const VOWELS = new Set(["α", "ε", "η", "ι", "ο", "υ", "ω"]);
const DIPHTHONGS = new Set(["αι", "αυ", "ει", "ευ", "οι", "ου", "υι", "ηυ"]);

export function syllabify(word) {
  // 使用NFD规范化，分解字符和变音符号
  word = word.normalize("NFD");

  // 存储呼气符号信息：位置和类型（粗糙/平滑）
  const breathingInfo = [];
  // 存储分音符号信息：位置
  const diaeresisInfo = [];

  // 遍历字符，记录符号信息
  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    // 检查呼气符号
    if (char === "\u0313" || char === "\u0314") {
      // 呼气符号出现在元音前，所以实际位置是前一个字符
      if (i > 0) {
        const vowelIndex = i - 1;
        breathingInfo.push({
          position: vowelIndex,
          type: char === "\u0313" ? "smooth" : "rough",
        });
      }
    }

    // 检查分音符号
    else if (char === "\u0308") {
      if (i > 0) {
        diaeresisInfo.push(i - 1);
      }
    }
  }

  // 移除所有变音符号，只保留字母
  word = word.replace(/[\u0300-\u036f]/g, "");
  if (!word) return null;

  const results = [];
  let queue = [{ start: 0, index: 0, syllables: [] }];

  while (queue.length > 0) {
    const { start, index, syllables } = queue.shift();
    if (index >= word.length) {
      results.push(syllables);
      continue;
    }

    // 检查分音符号：如果有分音符号，不能组成双元音
    let isDiaeresis = diaeresisInfo.some(
      (pos) => pos === index || pos === index + 1,
    );
    let nucleus = 0;

    // 只有在没有分音符号的情况下才检查双元音
    if (
      !isDiaeresis &&
      index + 1 < word.length &&
      DIPHTHONGS.has(word.substring(index, index + 2))
    ) {
      nucleus = 2;
    } else if (VOWELS.has(word[index])) {
      nucleus = 1;
    } else {
      // 跳过辅音
      queue.push({ start: start, index: index + 1, syllables });
      continue;
    }

    const nucleusEnd = index + nucleus;

    // 找下一个元音
    let nextIndex = nucleusEnd;
    while (nextIndex < word.length && !VOWELS.has(word[nextIndex])) {
      nextIndex++;
    }

    const interCluster = word.substring(nucleusEnd, nextIndex);
    const k = interCluster.length;

    if (nextIndex === word.length) {
      // 末尾音节，全部归入当前音节
      const rawSyllable = word.substring(start);
      // 添加呼气符号到音节
      const syllableWithBreathing = addBreathingToSyllable(
        rawSyllable,
        start,
        breathingInfo,
      );
      results.push([...syllables, syllableWithBreathing]);
      continue;
    }

    const cutPositions = [];
    if (k < 2) {
      cutPositions.push(nucleusEnd);
    } else if (k > 4) {
      return null; // 不处理复杂辅音群
    } else {
      for (let cut = nucleusEnd; cut < nucleusEnd + k; cut++) {
        if (k - (cut - nucleusEnd) < 3 && cut - nucleusEnd < 3) {
          cutPositions.push(cut);
        }
      }
    }

    for (const cut of cutPositions) {
      const rawSyllable = word.substring(start, cut);
      // 添加呼气符号到音节
      const syllableWithBreathing = addBreathingToSyllable(
        rawSyllable,
        start,
        breathingInfo,
      );
      queue.push({
        start: cut,
        index: nextIndex,
        syllables: [...syllables, syllableWithBreathing],
      });
    }
  }

  return results;
}

// 辅助函数：为音节添加呼气符号
function addBreathingToSyllable(syllable, startPos, breathingInfo) {
  // 检查音节中的每个字符是否需要添加呼气符号
  let result = "";

  for (let i = 0; i < syllable.length; i++) {
    const char = syllable[i];
    const originalPos = startPos + i;

    // 查找这个位置是否有呼气符号
    const breathing = breathingInfo.find(
      (info) => info.position === originalPos,
    );

    if (breathing && VOWELS.has(char)) {
      // 添加呼气符号
      const breathingChar = breathing.type === "smooth" ? "\u0313" : "\u0314";
      // 呼气符号在元音之前
      result = result + char + breathingChar;
    } else {
      result += char;
    }
  }

  return result;
}
