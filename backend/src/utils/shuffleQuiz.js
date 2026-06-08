// utils/shuffleQuiz.js

/**
 * Fisher–Yates shuffle (in-place, unbiased)
 * @param {Array} array
 * @returns {Array}
 */
export const shuffleArray = (array = []) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Shuffle quiz questions AND options safely
 * - Preserves correctIndex mapping
 * - Ensures fresh order every generation / reattempt
 *
 * @param {Array} questions
 * @returns {Array}
 */
const shuffleQuiz = (questions = []) => {
  return shuffleArray(questions).map((q) => {
    const optionsWithIndex = q.options.map((opt, idx) => ({
      text: opt,
      index: idx,
    }));

    const shuffledOptions = shuffleArray(optionsWithIndex);

    const newCorrectIndex = shuffledOptions.findIndex(
      (o) => o.index === q.correctIndex
    );

    return {
      question: q.question,
      options: shuffledOptions.map((o) => o.text),
      correctIndex: newCorrectIndex,
      explanation: q.explanation,
    };
  });
};

export default shuffleQuiz;
