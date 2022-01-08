export function truncate(
  source: string | undefined,
  length: number,
  isExpanded?: boolean,
) {
  if (isExpanded) {
    return source
  }

  if (!source) {
    return ''
  }

  return source.length > length ? `${source.substring(0, length)}...` : source
}
