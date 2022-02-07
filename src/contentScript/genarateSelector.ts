import { VALID_ATTRIBUTES, DATA_ATTRIBUTES } from './constants'

function getSelectorLength(selector: string) {
  return document?.querySelectorAll(selector)?.length ?? 1
}

export const generateSelectors = (
  target: Element,
  { uniqueSelector, tagName }: { uniqueSelector: string; tagName: string },
) => {
  const role = target?.getAttribute('role')
  const ariaLabel = target?.ariaLabel
  const placeholder = target?.getAttribute('placeholder')
  const textContent = target?.textContent
  const classAttribute = target?.getAttribute('class')
  const className = classAttribute
    ? `.${classAttribute.replace(/ +/g, '.')}`
    : ''
  const elementId = target?.getAttribute('id')
    ? `#${target?.getAttribute('id')}`
    : ''

  const customDataAttributes = Object.values(target?.attributes ?? []).reduce(
    (data: Record<string, string | number>[], attribute) => {
      const name = (attribute as { name: string })?.name
      const value = (attribute as { value: string })?.value
      if (DATA_ATTRIBUTES.includes(name)) {
        return [
          {
            name,
            value: `[${name}="${value}"]`,
            length: getSelectorLength(`[${name}="${value}"]`),
            priority: 1,
            rawValue: value,
          },
          ...data,
        ]
      }

      if (VALID_ATTRIBUTES.includes(name) && value && tagName) {
        return [
          {
            name,
            value: `${tagName}[${name}="${value}"]`,
            length: getSelectorLength(`${tagName}[${name}="${value}"]`),
            priority: 2,
            rawValue: value,
          },
          ...data,
        ]
      }

      return data
    },
    [],
  )

  return [
    ...customDataAttributes,
    textContent && {
      name: 'text',
      value: textContent,
      length: Array.from(document.querySelectorAll(tagName)).filter(
        (el) => el.textContent === textContent,
      ).length,
      priority: 1,
      rawValue: textContent,
    },
    ariaLabel && {
      name: 'aria-label',
      value: `[aria-label="${ariaLabel}"]`,
      length: getSelectorLength(`[aria-label="${ariaLabel}"]`),
      priority: 2,
      rawValue: ariaLabel,
    },
    placeholder && {
      name: 'placeholder',
      value: `[placeholder="${placeholder}"]`,
      length: getSelectorLength(`[placeholder="${placeholder}"]`),
      priority: 2,
      rawValue: placeholder,
    },
    role && {
      name: 'role',
      value: `[role="${role}"]`,
      length: getSelectorLength(`[role="${role}"]`),
      priority: 2,
      rawValue: role,
    },
    elementId && {
      name: '#element-id',
      value: elementId,
      length: getSelectorLength(elementId),
      priority: 2,
      rawValue: elementId,
    },
    {
      name: 'unique-path',
      value: uniqueSelector,
      length: getSelectorLength(uniqueSelector),
      priority: 3,
      rawValue: uniqueSelector,
    },
    className && {
      name: '.classname',
      value: className,
      length: getSelectorLength(className),
      priority: 3,
      rawValue: className,
    },
    tagName && {
      name: '<tagName>',
      value: tagName,
      length: getSelectorLength(tagName),
      priority: 3,
      rawValue: tagName,
    },
  ].filter((sel) => !!sel)
}
