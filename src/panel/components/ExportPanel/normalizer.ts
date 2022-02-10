const CHARS_TO_REPLACE_PAIRS = [
  ['\\', '\\\\'],
  ['\n', '\\n'],
  // eslint-disable-next-line
  ["'", "\\'"],
  ['"', '\\"'],
  ['\b', '\\b'],
  ['\f', '\\f'],
  ['\r', '\\r'],
  ['\t', '\\t'],
  ['\v', '\\v'],
]

export const normalizeString = (str: string | undefined) => {
  if (!str) {
    return ''
  }

  return CHARS_TO_REPLACE_PAIRS.reduce(
    (acc, [from, to]) => acc.replaceAll(from, to),
    str,
  )
}
