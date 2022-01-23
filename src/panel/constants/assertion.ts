export enum assertionTypes {
  inDocument = 'inDocument',
  contains = 'contains',
  // equals = 'equals',
  hasAttribute = 'hasAttribute',
  notContains = 'notContains',
  notInDocument = 'notInDocument',
  // notEquals = 'notEquals',
  notHasAttribute = 'notHasAttribute',
}

export const assertionsList: Record<string, string>[] = [
  { type: assertionTypes.inDocument, name: 'Is in document' },
  { type: assertionTypes.contains, name: 'Contains' },
  // { type: assertionTypes.equals, name: 'Equals' },
  { type: assertionTypes.hasAttribute, name: 'Has attribute' },
]

export const assertionsListNegative: Record<string, string>[] = [
  { type: assertionTypes.notInDocument, name: 'Is not in document' },
  { type: assertionTypes.notContains, name: 'Not Contains' },
  // { type: assertionTypes.notEquals, name: 'Not equals' },
  { type: assertionTypes.notHasAttribute, name: 'Has no attribute' },
]
