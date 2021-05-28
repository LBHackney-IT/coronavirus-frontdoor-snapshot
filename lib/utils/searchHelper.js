const commonWords = [
  'and',
  'that',
  'but',
  'or',
  'as',
  'if',
  'when',
  'than',
  'because',
  'while',
  'where',
  'after',
  'so',
  'though',
  'since',
  'until',
  'whether',
  'before',
  'although',
  'nor',
  'like',
  'once',
  'unless',
  'now',
  'except',
  'is'
];

const removeCommonWords = words => {
  return words.filter(word => !commonWords.includes(word) && word.length > 1);
};

export { removeCommonWords };
