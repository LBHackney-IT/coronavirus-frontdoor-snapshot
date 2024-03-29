import { normalise } from './normalise';

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
  'is',
  'of',
  'an',
  'hackney',
  'advice',
  'support',
  'with'
];

const removeCommonWords = words => {
  return words.filter(word => !commonWords.includes(word) && word.length > 1);
};

const getSearchableFields = resource => {
  return {
    name: getSearchableField(resource.name),
    description: getSearchableField(resource.description),
    serviceDescription: getSearchableField(resource.serviceDescription)
  };
};

const getSearchableField = field => {
  return field ? normalise(field) : '';
};

export { removeCommonWords, getSearchableFields };
