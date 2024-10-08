const questionsDataKatakanaToRomaji = [
  {
    type: "text",
    question: "ア",
    answers: ["a", "i", "u", "e"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "イ",
    answers: ["o", "u", "i", "e"],
    correctAnswer: 2,
  },
  {
    type: "text",
    question: "ウ",
    answers: ["e", "u", "o", "a"],
    correctAnswer: 1,
  },
  {
    type: "text",
    question: "エ",
    answers: ["i", "u", "o", "e"],
    correctAnswer: 3,
  },
  {
    type: "text",
    question: "オ",
    answers: ["o", "a", "u", "i"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "カ",
    answers: ["ka", "sa", "ta", "na"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "キ",
    answers: ["ni", "shi", "chi", "ki"],
    correctAnswer: 3,
  },
  {
    type: "text",
    question: "ク",
    answers: ["ku", "su", "tsu", "nu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ケ",
    answers: ["se", "te", "ne", "ke"],
    correctAnswer: 3,
  },
  {
    type: "text",
    question: "コ",
    answers: ["ko", "so", "to", "no"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "サ",
    answers: ["sa", "ta", "na", "ha"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "シ",
    answers: ["shi", "chi", "ni", "hi"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ス",
    answers: ["su", "tsu", "nu", "fu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "セ",
    answers: ["se", "te", "ne", "he"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ソ",
    answers: ["so", "to", "no", "ho"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "タ",
    answers: ["ta", "da", "sa", "na"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "チ",
    answers: ["chi", "shi", "ji", "ni"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ツ",
    answers: ["tsu", "su", "nu", "fu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "テ",
    answers: ["te", "de", "se", "ne"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ト",
    answers: ["to", "do", "no", "ho"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ナ",
    answers: ["na", "ma", "ra", "ya"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ニ",
    answers: ["ni", "mi", "ri", "ji"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ヌ",
    answers: ["nu", "mu", "ru", "yu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ネ",
    answers: ["ne", "me", "re", "he"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ノ",
    answers: ["no", "mo", "ro", "yo"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ハ",
    answers: ["ha", "ba", "pa", "ma"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ヒ",
    answers: ["hi", "bi", "pi", "mi"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "フ",
    answers: ["fu", "bu", "pu", "mu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ヘ",
    answers: ["he", "be", "pe", "me"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ホ",
    answers: ["ho", "bo", "po", "mo"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "マ",
    answers: ["ma", "na", "sa", "ra"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ミ",
    answers: ["mi", "ni", "shi", "ri"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ム",
    answers: ["mu", "nu", "su", "ru"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "メ",
    answers: ["me", "ne", "se", "re"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "モ",
    answers: ["mo", "no", "so", "ro"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ヤ",
    answers: ["ya", "ma", "ra", "wa"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ユ",
    answers: ["yu", "mu", "ru", "fu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ヨ",
    answers: ["yo", "mo", "ro", "to"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ラ",
    answers: ["ra", "la", "ya", "wa"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "リ",
    answers: ["ri", "li", "yi", "wi"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ル",
    answers: ["ru", "lu", "yu", "wu"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "レ",
    answers: ["re", "le", "ye", "we"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ロ",
    answers: ["ro", "lo", "yo", "wo"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ワ",
    answers: ["wa", "ra", "ya", "pa"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ヲ",
    answers: ["wo", "ro", "yo", "po"],
    correctAnswer: 0,
  },
  {
    type: "text",
    question: "ン",
    answers: ["n", "m", "nn", "nm"],
    correctAnswer: 0,
  },
];

export { questionsDataKatakanaToRomaji };

const questionsDataKatakanaAudio = [
  {
    type: "audio",
    question: "ア",
    answers: ["ア", "イ", "ウ", "エ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "イ",
    answers: ["オ", "ウ", "イ", "エ"],
    correctAnswer: 2,
  },
  {
    type: "audio",
    question: "ウ",
    answers: ["エ", "ウ", "オ", "ア"],
    correctAnswer: 1,
  },
  {
    type: "audio",
    question: "エ",
    answers: ["イ", "ウ", "オ", "エ"],
    correctAnswer: 3,
  },
  {
    type: "audio",
    question: "オ",
    answers: ["オ", "ア", "ウ", "イ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "カ",
    answers: ["カ", "サ", "タ", "ナ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "キ",
    answers: ["ニ", "シ", "チ", "キ"],
    correctAnswer: 3,
  },
  {
    type: "audio",
    question: "ク",
    answers: ["ク", "ス", "ツ", "ヌ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ケ",
    answers: ["セ", "テ", "ネ", "ケ"],
    correctAnswer: 3,
  },
  {
    type: "audio",
    question: "コ",
    answers: ["コ", "ソ", "ト", "ノ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "サ",
    answers: ["サ", "タ", "ナ", "ハ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "シ",
    answers: ["シ", "チ", "ニ", "ヒ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ス",
    answers: ["ス", "ツ", "ヌ", "フ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "セ",
    answers: ["セ", "テ", "ネ", "ヘ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ソ",
    answers: ["ソ", "ト", "ノ", "ホ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "タ",
    answers: ["タ", "ダ", "サ", "ナ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "チ",
    answers: ["チ", "シ", "ジ", "ニ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ツ",
    answers: ["ツ", "ス", "ヌ", "フ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "テ",
    answers: ["テ", "デ", "セ", "ネ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ト",
    answers: ["ト", "ド", "ノ", "ホ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ナ",
    answers: ["ナ", "マ", "ラ", "ヤ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ニ",
    answers: ["ニ", "ミ", "リ", "ジ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ヌ",
    answers: ["ヌ", "ム", "ル", "ユ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ネ",
    answers: ["ネ", "メ", "レ", "ヘ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ノ",
    answers: ["ノ", "モ", "ロ", "ヨ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ハ",
    answers: ["ハ", "バ", "パ", "マ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ヒ",
    answers: ["ヒ", "ビ", "ピ", "ミ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "フ",
    answers: ["フ", "ブ", "プ", "ム"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ヘ",
    answers: ["ヘ", "ベ", "ペ", "メ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ホ",
    answers: ["ホ", "ボ", "ポ", "モ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "マ",
    answers: ["マ", "ナ", "サ", "ラ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ミ",
    answers: ["ミ", "ニ", "シ", "リ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ム",
    answers: ["ム", "ヌ", "ス", "ル"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "メ",
    answers: ["メ", "ネ", "セ", "レ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "モ",
    answers: ["モ", "ノ", "ソ", "ロ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ヤ",
    answers: ["ヤ", "マ", "ラ", "ワ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ユ",
    answers: ["ユ", "ム", "ル", "フ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ヨ",
    answers: ["ヨ", "モ", "ロ", "ト"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ラ",
    answers: ["ラ", "ワ", "ヤ", "マ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "リ",
    answers: ["リ", "イ", "シ", "チ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ル",
    answers: ["ル", "ウ", "ス", "ツ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "レ",
    answers: ["レ", "エ", "セ", "テ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ロ",
    answers: ["ロ", "オ", "ト", "コ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ワ",
    answers: ["ワ", "ラ", "ヤ", "タ"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ヲ",
    answers: ["ヲ", "オ", "ヨ", "ト"],
    correctAnswer: 0,
  },
  {
    type: "audio",
    question: "ン",
    answers: ["ン", "アン", "イン", "ウン"],
    correctAnswer: 0,
  },
];

export { questionsDataKatakanaAudio };
