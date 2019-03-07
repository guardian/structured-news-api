import {
  encodeStringForSSML,
  stripExcessWhitespace,
} from '../nastySSMLGeneration';

describe('encodeStringForSSML', () => {
  test('should replace & with XML excape string', () => {
    const input = 'This & That';
    const expectedOutput = 'This &amp; That';
    expect(encodeStringForSSML(input)).toEqual(expectedOutput);
  });

  test('should replace " with XML excape string', () => {
    const input = '"hello"';
    const expectedOutput = '&quot;hello&quot;';
    expect(encodeStringForSSML(input)).toEqual(expectedOutput);
  });

  test("should replace ' with XML excape string", () => {
    const input = "'hello'";
    const expectedOutput = '&apos;hello&apos;';
    expect(encodeStringForSSML(input)).toEqual(expectedOutput);
  });

  test('should replace < with XML excape string', () => {
    const input = '<';
    const expectedOutput = '&lt;';
    expect(encodeStringForSSML(input)).toEqual(expectedOutput);
  });

  test('should replace > with XML excape string', () => {
    const input = '>';
    const expectedOutput = '&gt;';
    expect(encodeStringForSSML(input)).toEqual(expectedOutput);
  });
});

describe('stripExcessWhitespace', () => {
  test('should remove repeated whitespace', () => {
    const input = 'This That.    This';
    const expectedOutput = 'This That.This';
    expect(stripExcessWhitespace(input)).toEqual(expectedOutput);
  });

  test('should not change single whitespace characters', () => {
    const input = 'This That. This';
    const expectedOutput = 'This That. This';
    expect(stripExcessWhitespace(input)).toEqual(expectedOutput);
  });
});
