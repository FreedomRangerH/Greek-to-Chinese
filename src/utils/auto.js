// auto.js

import { useDataStore } from "../data";

export function auto(chinese, syllables, pronunces) {
  const data = useDataStore();

  if (!chinese) {
    for (const syllable of syllables) {
      if (data.getPronunce(syllable)) {
        pronunces.push(data.getPronunce(syllable));
      } else {
        return;
      }
    }
  } else {
    let c = chinese.length;
    pronunces?.forEach((pronunce) => {
      c -= pronunce.length;
    });

    while (
      pronunces.length < syllables.length &&
      c >= syllables.length - pronunces.length
    ) {
      const oldPeounce = data.getPronunce(syllables[pronunces.length]);
      if (c === syllables.length - pronunces.length) {
        const newPronunce = chinese.substring(
          chinese.length - c,
          chinese.length - c + 1
        );
        if (oldPeounce && oldPeounce !== newPronunce) {
          return;
        }
        pronunces.push(newPronunce);
        c -= 1;
      } else if (oldPeounce) {
        const newPronunce = chinese.substring(
          chinese.length - c,
          chinese.length - c + oldPeounce.length
        );
        if (oldPeounce !== newPronunce) {
          return;
        }
        pronunces.push(newPronunce);
        c -= newPronunce.length;
      } else if (syllables.length - pronunces.length === 1) {
        const newPronunce = chinese.substring(
          chinese.length - c,
          chinese.length
        );
        pronunces.push(newPronunce);
        return;
      } else {
        return;
      }
    }
  }
}
