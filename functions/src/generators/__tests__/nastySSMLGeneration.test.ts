import { formatSSML } from '../nastySSMLGeneration';

describe('formatSSML', () => {
  test('should replace & with XML excape string', () => {
    const input = 'This & That';
    const expectedOutput = 'This &amp; That';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });

  test('should replace " with XML excape string', () => {
    const input = '"hello"';
    const expectedOutput = '&quot;hello&quot;';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });

  test("should replace ' with XML excape string", () => {
    const input = "'hello'";
    const expectedOutput = '&apos;hello&apos;';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });

  test('should replace < with XML excape string', () => {
    const input = '<';
    const expectedOutput = '&lt;';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });

  test('should replace > with XML excape string', () => {
    const input = '>';
    const expectedOutput = '&gt;';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });

  test('should remove repeated whitespace', () => {
    const input = 'This That.    This';
    const expectedOutput = 'This That.This';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });

  test('should not change single whitespace characters', () => {
    const input = 'This That. This';
    const expectedOutput = 'This That. This';
    expect(formatSSML(input)).toEqual(expectedOutput);
  });
});
