export enum assertionTypes {
  inDocument = 'inDocument',
  contains = 'contains',
  // equals = 'equals',
  hasAttribute = 'hasAttribute',
  notContains = 'notContains',
  notInDocument = 'notInDocument',
  // notEquals = 'notEquals',
  notHasAttribute = 'notHasAttribute',
  toBeDisabled = 'toBeDisabled',
  notToBeDisabled = 'notToBeDisabled',
  toBeEnabled = 'toBeEnabled',
  notToBeEnabled = 'notToBeEnabled',
  toHaveTitle = 'toHaveTitle',
  notToHaveTitle = 'notToHaveTitle',
  toBeHidden = 'toBeHidden',
  notToBeHidden = 'notToBeHidden',
  toHaveURL = 'toHaveURL',
  notToHaveURL = 'notToHaveURL',
}

export const assertionsList: Record<string, string>[] = [
  { type: assertionTypes.inDocument, name: 'Is in document' },
  { type: assertionTypes.contains, name: 'Contains' },
  // { type: assertionTypes.equals, name: 'Equals' },
  { type: assertionTypes.hasAttribute, name: 'Has attribute' },
  { type: assertionTypes.toBeDisabled, name: 'To be disabled' },
  { type: assertionTypes.toBeEnabled, name: 'To be enabled' },
  { type: assertionTypes.toHaveTitle, name: 'To have title' },
  { type: assertionTypes.toBeHidden, name: 'To be hidden' },
  { type: assertionTypes.toHaveURL, name: 'To have URL' },
]

export const assertionsListNegative: Record<string, string>[] = [
  { type: assertionTypes.notInDocument, name: 'Is not in document' },
  { type: assertionTypes.notContains, name: 'Not Contains' },
  // { type: assertionTypes.notEquals, name: 'Not equals' },
  { type: assertionTypes.notHasAttribute, name: 'Has no attribute' },
  { type: assertionTypes.notToBeDisabled, name: 'Not to be disabled' },
  { type: assertionTypes.notToBeEnabled, name: 'Not to be enabled' },
  { type: assertionTypes.notToHaveTitle, name: 'Not to have title' },
  { type: assertionTypes.notToBeHidden, name: 'Not to be hidden' },
  { type: assertionTypes.notToHaveURL, name: 'Not to have URL' },
]
