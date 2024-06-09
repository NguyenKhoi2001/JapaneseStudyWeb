/**
 * Generates Furigana markup for a given Japanese sentence and its Hiragana conversion.
 *
 * @param {string} original - The original sentence with Kanji.
 * @param {string} hiragana - The Hiragana conversion of the sentence.
 * @returns {string} - The generated HTML markup with <ruby> tags for Furigana.
 */
export const generateFuriganaMarkup = (original, hiragana) => {
  let markup = "";
  let kanjiBuffer = "";
  let hiraBuffer = "";
  let hiraIndex = 0;

  const flushBuffers = () => {
    if (kanjiBuffer) {
      markup += `<ruby>${kanjiBuffer}<rt>${hiraBuffer}</rt></ruby>`;
      kanjiBuffer = "";
      hiraBuffer = "";
    }
  };

  for (let oIndex = 0; oIndex < original.length; oIndex++) {
    const char = original[oIndex];
    if (char.match(/[\u3400-\u9FBF]/)) {
      kanjiBuffer += char;
      while (
        hiraIndex < hiragana.length &&
        original.indexOf(hiragana[hiraIndex], oIndex) === -1
      ) {
        hiraBuffer += hiragana[hiraIndex++];
      }
    } else {
      flushBuffers();
      markup += char;
      if (char === hiragana[hiraIndex]) {
        hiraIndex++;
      }
    }
  }
  flushBuffers();
  return markup;
};
