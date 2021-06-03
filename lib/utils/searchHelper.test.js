import { removeCommonWords } from 'lib/utils/searchHelper';

describe('search helper', () => {
  it('returns items minus those that are common conjunctions', () => {
    const words = ['as', 'is', 'a', ' ', '&', 'Orc', 'Zebra'];
    const expectedResult = ['Orc', 'Zebra'];
    const filteredWords = removeCommonWords(words);

    // expect(filteredWords.length).toBe(2);
    expect(filteredWords).toEqual(expectedResult);
  });
});
