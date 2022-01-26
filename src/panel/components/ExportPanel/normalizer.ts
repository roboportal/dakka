export const normalizeString = (str: string | undefined) => {
  if (!str) {
    return ''
  }

  return (
    str
      .replaceAll('\\', '\\\\')
      .replaceAll('\n', '\\n')
      // eslint-disable-next-line
      .replaceAll("'", "\\'")
  )
}
