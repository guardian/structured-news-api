const encodeStringForSSML = (s: string) => {
  const controlCharacters: { [name: string]: string } = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  };
  const xmlEncodedSSML = s.replace(
    /[&|"|'|<|>]/g,
    char => controlCharacters[char] || ''
  );
  return xmlEncodedSSML;
};

const stripExcessWhitespace = (ssml: string) => {
  return ssml.replace(/\s\s+/g, '');
};

export { encodeStringForSSML, stripExcessWhitespace };
