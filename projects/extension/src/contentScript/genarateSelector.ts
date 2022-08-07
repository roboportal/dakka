import { VALID_ATTRIBUTES, DATA_ATTRIBUTES } from './constants'

function getSelectorLength(selector: string) {
  try {
    return document?.querySelectorAll(selector)?.length ?? 1
  } catch {
    return 1
  }
}

function getTextContentSelectorLength(tagName: string, textContent: string) {
  try {
    return Array.from(document.querySelectorAll(tagName)).filter(
      (el) =>
        el?.firstChild?.nodeValue?.toLocaleLowerCase() ===
        textContent?.toLocaleLowerCase(),
    ).length
  } catch {
    return 1
  }
}

export const generateSelectors = (
  target: Element,
  { uniqueSelector, closest }: { uniqueSelector?: string; closest: number },
) => {
  const tagName = (target?.tagName ?? '*').toLowerCase()
  const role = target?.getAttribute('role')
  const ariaLabel = target?.ariaLabel ?? ''
  const placeholder = target?.getAttribute('placeholder') ?? ''
  const elementType = target?.getAttribute('type') ?? ''
  const textContent = target?.firstChild?.nodeValue ?? ''
  const classAttribute = target?.getAttribute('class')
  const className = classAttribute
    ? `.${classAttribute.replace(/ +/g, '.')}`
    : ''
  const elementId = target?.getAttribute('id')
    ? `#${target?.getAttribute('id')}`
    : ''

  const commonIdentifiers = {
    closest,
    tagName,
    elementType,
    ariaLabel,
    placeholder,
    textContent,
  }

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
            ...commonIdentifiers,
          },
          ...data,
        ]
      }

      if (VALID_ATTRIBUTES.includes(name) && value && tagName) {
        const validAttribute = {
          name,
          value: `${tagName}[${name}="${value}"]`,
          length: getSelectorLength(`${tagName}[${name}="${value}"]`),
          priority: 2,
          rawValue: value,
          ...commonIdentifiers,
        }

        if (value === 'text' && name === 'type') {
          return [...data, validAttribute]
        }

        return [validAttribute, ...data]
      }

      return data
    },
    [],
  )

  return [
    ...customDataAttributes,
    textContent &&
      !!textContent?.replace(/\s/g, '')?.length && {
        name: 'text',
        value: textContent,
        length: getTextContentSelectorLength(tagName, textContent),
        priority: 1,
        rawValue: textContent,
        ...commonIdentifiers,
      },
    ariaLabel && {
      name: 'aria-label',
      value: `[aria-label="${ariaLabel}"]`,
      length: getSelectorLength(`[aria-label="${ariaLabel}"]`),
      priority: 2,
      rawValue: ariaLabel,
      ...commonIdentifiers,
    },
    placeholder && {
      name: 'placeholder',
      value: `[placeholder="${placeholder}"]`,
      length: getSelectorLength(`[placeholder="${placeholder}"]`),
      priority: 2,
      rawValue: placeholder,
      ...commonIdentifiers,
    },
    role && {
      name: 'role',
      value: `[role="${role}"]`,
      length: getSelectorLength(`[role="${role}"]`),
      priority: 2,
      rawValue: role,
      ...commonIdentifiers,
    },
    elementId &&
      tagName && {
        name: 'tagName#element-id',
        value: `${tagName}${elementId}`,
        length: getSelectorLength(elementId),
        priority: 2,
        rawValue: elementId,
        ...commonIdentifiers,
      },
    elementId && {
      name: '#element-id',
      value: elementId,
      length: getSelectorLength(elementId),
      priority: 2,
      rawValue: elementId,
      ...commonIdentifiers,
    },
    className && {
      name: '.classname',
      value: className,
      length: getSelectorLength(className),
      priority: 3,
      rawValue: className,
      ...commonIdentifiers,
    },
    uniqueSelector &&
      uniqueSelector !== className && {
        name: 'unique-path',
        value: uniqueSelector,
        length: getSelectorLength(uniqueSelector),
        priority: 3,
        rawValue: uniqueSelector,
        ...commonIdentifiers,
      },
    tagName && {
      name: '<tagName>',
      value: tagName,
      length: getSelectorLength(tagName),
      priority: 3,
      rawValue: tagName,
      ...commonIdentifiers,
    },
  ].filter((sel) => !!sel)
}
