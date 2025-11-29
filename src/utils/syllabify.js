// syllabify.js

const VOWELS = new Set(["α", "ε", "η", "ι", "ο", "υ", "ω"]);
const DIPHTHONGS = new Set(["αι", "αυ", "ει", "ευ", "οι", "ου", "υι", "ηυ"]);

export function syllabify(word) {
  word = word.normalize("NFD").replace(/[^\p{L}]/gu, "");
  if (!word) return null;

  const results = [];
  let queue = [{ start:0, index: 0, syllables: [] }];

  while (queue.length > 0) {
    const { start, index, syllables } = queue.shift();
    if (index >= word.length) {
      results.push(syllables);
      continue;
    }

    // 找下一个元音
    let nucleus = 0;
    if (index + 1 < word.length && DIPHTHONGS.has(word.substring(index, index + 2))
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
      const newSyllable = word.substring(start);
      results.push([...syllables, newSyllable]);
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
      const newSyllable = word.substring(start, cut);
      queue.push({ start: cut, index: nextIndex, syllables: [...syllables, newSyllable] });
    }
  }

  return results;
}
