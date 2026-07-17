const MALE_TOKENS = [
  'okey dex', 'ok dex', 'hey dex', 'oye dex', 'okay dex', 'escucha dex',
  'okey decs', 'hey decs', 'ok decs',
  'dex', 'decs', 'tex', 'lex', 'rex', 'des', 'next', 'the ex', 'deck'
];

const FEMALE_TOKENS = [
  'okey dexy', 'ok dexy', 'hey dexy', 'oye dexy', 'okay dexy', 'escucha dexy',
  'okey decsi', 'hey decsi', 'ok decsi',
  'dexy', 'dexi', 'decsi', 'texi', 'lexi', 'desi', 'sexy', 'pepsi', 'decky'
];

function detectWake(text, gender) {
  const t = text.toLowerCase().trim();
  const tokens = t.split(/\s+/);
  const recentText = tokens.slice(-8).join(' '); // Solo buscar en las últimas 8 palabras

  const tokensToMatch = gender === 'female' ? FEMALE_TOKENS : MALE_TOKENS;

  for (const token of tokensToMatch) {
    if (new RegExp(`(?:^|\\s)${token}(?:\\s|$|,|\\.|!|\\?)`, 'i').test(recentText)) return true;
  }
  return false;
}

console.log("okey dexy (female):", detectWake("okey dexy", "female"));
console.log("okey dex (male):", detectWake("okey dex", "male"));
console.log("okey dex (female):", detectWake("okey dex", "female"));
