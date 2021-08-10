import { getRecentStatus, parseAddress } from 'lib/utils/referralHelper';

describe('parseAddress', () => {
  it('should parse comma separated address lines & post code into newline separated address lines', () => {
    // arrange
    const commaSeparatedAddress = 'Amhurst Road, Flat 5B, Hackney';
    const postcode = 'E8 1LL';

    const expectedOutput = 'Amhurst Road\nFlat 5B\nHackney\nE8 1LL';

    // act
    const newlineSeparated = parseAddress(commaSeparatedAddress, postcode);

    // assert
    expect(newlineSeparated).toEqual(expectedOutput);
  });

  it('should display the address with no new line at the end when postcode is not provided', () => {
    // arrange
    const commaSeparatedAddress = 'Amhurst Road, Flat 5B, Hackney';

    const expectedOutput = 'Amhurst Road\nFlat 5B\nHackney';

    // act
    const newlineSeparated1 = parseAddress(commaSeparatedAddress);
    const newlineSeparated2 = parseAddress(commaSeparatedAddress, null);
    const newlineSeparated3 = parseAddress(commaSeparatedAddress, undefined);
    const newlineSeparated4 = parseAddress(commaSeparatedAddress, '');

    // assert
    expect(newlineSeparated1).toEqual(expectedOutput);
    expect(newlineSeparated2).toEqual(expectedOutput);
    expect(newlineSeparated3).toEqual(expectedOutput);
    expect(newlineSeparated4).toEqual(expectedOutput);
  });

  it('should display the postcode, when addresslines are empty', () => {
    // arrange
    const postcode = 'E8 1LL';

    const expectedOutput = 'E8 1LL';

    // act
    const newlineSeparated1 = parseAddress(null, postcode);
    const newlineSeparated2 = parseAddress(undefined, postcode);
    const newlineSeparated3 = parseAddress('', postcode);

    // assert
    expect(newlineSeparated1).toEqual(expectedOutput);
    expect(newlineSeparated2).toEqual(expectedOutput);
    expect(newlineSeparated3).toEqual(expectedOutput);
  });

  it('should display nothing, when nothing is given', () => {
    // arrange
    const expectedOutput = '';

    // act
    const newlineSeparated1 = parseAddress('');

    // assert
    expect(newlineSeparated1).toEqual(expectedOutput);
  });
});
