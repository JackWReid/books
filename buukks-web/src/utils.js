export function uniqueBy(a, key) {
  const seen = new Set();
  return a.filter(item => {
    const k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

export function stripHTML(string) {
  if (!string)
    return '';

  return string.replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/, '');
}

export function fadeString(string, fadeAfter) {
  if (!string)
    return '';

  if (!fadeAfter)
    return string;

  return string.substr(0, fadeAfter) + '...';
}
