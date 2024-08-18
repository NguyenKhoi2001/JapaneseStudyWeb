const mongoose = require("mongoose");
const Lesson = require("../../models/lesson.model");
const Vocabulary = require("../../models/vocabulary.model");
const Kanji = require("../../models/kanji.model");
const Grammar = require("../../models/grammar.model");
const Question = require("../../models/question.model");

const seedDatabaseLesson = async () => {
  try {
    const lessonCount = await Lesson.countDocuments();

    if (lessonCount < 25) {
      console.log("Seeding lessons...");

      // Fetch all available vocabularies, kanjis, and grammars
      const vocabularies = await Vocabulary.find().exec();
      const kanjis = await Kanji.find().exec();
      const grammars = await Grammar.find().exec();
      const questions = await Question.find().exec();

      for (let i = lessonCount; i < 25; i++) {
        // Calculate the range for the current lesson
        const vocabStartIndex = i * 5;
        const kanjiStartIndex = i * 5;
        const grammarIndex = i % grammars.length;
        const questionStartIndex = i * 5;

        // Slice the next 5 vocabularies and kanjis or remaining ones if fewer than 5
        const selectedVocabularies = vocabularies
          .slice(vocabStartIndex, vocabStartIndex + 5)
          .map((v) => v._id);
        const selectedKanjis = kanjis
          .slice(kanjiStartIndex, kanjiStartIndex + 5)
          .map((k) => k._id);
        const selectedQuestions = questions
          .slice(questionStartIndex, questionStartIndex + 5)
          .map((q) => q._id);
        const selectedGrammar = grammars[grammarIndex]
          ? grammars[grammarIndex]._id
          : null;

        const lesson = new Lesson({
          title: {
            jp: `第${i + 1}課`,
            en: `Lesson ${i + 1}`,
            vi: `Bài học ${i + 1}`,
          },
          vocabularies: selectedVocabularies,
          kanjis: selectedKanjis,
          grammars: selectedGrammar ? [selectedGrammar] : [],
          questions: selectedQuestions,
        });

        await lesson.save();
        console.log(`Lesson ${i + 1} seeded successfully.`);
      }

      console.log("All lessons seeded successfully.");
    } else {
      console.log("25 lessons already exist, not seeding.");
    }
  } catch (error) {
    console.error("Error seeding lessons:", error);
  }
};

module.exports = seedDatabaseLesson;
