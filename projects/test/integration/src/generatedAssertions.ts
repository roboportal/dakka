import assertionTemplate from '../mocks/assertionCombinations.json'
import framedAssertionTemplate from '../mocks/framedAssertionCombinations.json'

const buttonElement = {
  selectedSelector: {
    name: 'data-cy',
    value: '[data-cy="button"]',
    length: 1,
    priority: 1,
    rawValue: 'button',
    closest: 0,
    tagName: 'button',
  },
}

const disabledButtonElement = {
  selectedSelector: {
    name: 'data-cy',
    value: '[data-cy="disabled"]',
    length: 1,
    priority: 1,
    rawValue: 'button',
    closest: 0,
    tagName: 'button',
  },
}

const hiddenInputElement = {
  selectedSelector: {
    name: 'data-cy',
    value: '[data-cy="hidden"]',
    length: 1,
    priority: 1,
    rawValue: 'input',
    closest: 0,
    tagName: 'input',
  },
}

const values = {
  buttonInDocument: {
    assertionType: {
      type: 'inDocument',
    },
  },
  buttonContains: {
    assertionValue: 'Click',
    assertionType: {
      type: 'contains',
    },
  },
  buttonEquals: {
    assertionValue: 'Click',
    assertionType: {
      type: 'equals',
    },
  },
  hasAttribute: {
    assertionAttribute: 'id',
    assertionValue: 'button',
    assertionType: {
      type: 'hasAttribute',
    },
  },
  buttonToBeEnabled: {
    assertionValue: 'button',
    assertionType: {
      type: 'toBeEnabled',
    },
  },
  pageToHaveTitle: {
    assertionValue: 'Integration',
    assertionType: {
      type: 'toHaveTitle',
    },
  },
  pageToHaveURL: {
    assertionValue: 'https://master.d33h0yvwek6xsp.amplifyapp.com/',
    assertionType: {
      type: 'toHaveURL',
    },
  },
  buttonToHaveLength: {
    assertionValue: '1',
    assertionType: {
      type: 'toHaveLength',
    },
  },
  buttonToBeVisible: {
    assertionType: {
      type: 'toBeVisible',
    },
  },
  buttonToBeDisabled: {
    element: disabledButtonElement,
    assertionValue: 'Test',
    assertionType: {
      type: 'toBeDisabled',
    },
  },
  inputToBeHidden: {
    element: hiddenInputElement,
    assertionType: {
      type: 'toBeHidden',
    },
  },
}

const frameValues = {
  buttonInDocumentFrame: {
    assertionType: {
      type: 'inDocument',
    },
  },
  hasAttributeFrame: {
    assertionAttribute: 'id',
    assertionValue: 'button',
    assertionType: {
      type: 'hasAttribute',
    },
  },
  buttonToBeEnabledFrame: {
    assertionValue: 'button',
    assertionType: {
      type: 'toBeEnabled',
    },
  },
  buttonToHaveLengthFrame: {
    assertionValue: '1',
    assertionType: {
      type: 'toHaveLength',
    },
  },
  buttonToBeVisibleFrame: {
    assertionType: {
      type: 'toBeVisible',
    },
  },
  buttonContainsFrame: {
    assertionValue: 'Test',
    assertionType: {
      type: 'contains',
    },
  },
  buttonEqualsFrame: {
    assertionValue: 'Test',
    assertionType: {
      type: 'equals',
    },
  },
  buttonToBeDisabledFrame: {
    element: disabledButtonElement,
    assertionValue: 'Test',
    assertionType: {
      type: 'toBeDisabled',
    },
  },
  pageToHaveTitleFrame: {
    assertionValue: '',
    assertionType: {
      type: 'toHaveTitle',
    },
  },
  pageToHaveURLFrame: {
    assertionValue: 'https://master.d33h0yvwek6xsp.amplifyapp.com/frame.html',
    assertionType: {
      type: 'toHaveURL',
    },
  },
  inputToBeHiddenFrame: {
    element: hiddenInputElement,
    assertionType: {
      type: 'toBeHidden',
    },
  },
}

const notValues = {
  buttonNotContains: {
    element: buttonElement,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notContains',
    },
  },
  buttonNotEquals: {
    element: buttonElement,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notEquals',
    },
  },
  notHasAttribute: {
    element: buttonElement,
    assertionAttribute: 'not-id',
    assertionValue: 'not-button',
    assertionType: {
      type: 'notHasAttribute',
    },
  },
  pageNotToHaveTitle: {
    assertionValue: 'NotIntegration',
    assertionType: {
      type: 'notToHaveTitle',
    },
  },
  pageNotToHaveURL: {
    assertionValue: 'https://not.master.d33h0yvwek6xsp.amplifyapp.com/',
    assertionType: {
      type: 'notToHaveURL',
    },
  },
  buttonNotToHaveLength: {
    element: buttonElement,
    assertionValue: '2',
    assertionType: {
      type: 'notToHaveLength',
    },
  },
  buttonNotToBeDisabled: {
    element: buttonElement,
    assertionValue: '2',
    assertionType: {
      type: 'notToBeDisabled',
    },
  },
  buttonNotToBeEnabled: {
    element: disabledButtonElement,
    assertionType: {
      type: 'notToBeEnabled',
    },
  },
  buttonNotToBeHidden: {
    assertionType: {
      type: 'notToBeHidden',
    },
  },
}

const frameNotValues = {
  buttonNotContains: {
    element: buttonElement,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notContains',
    },
  },
  buttonNotEquals: {
    element: buttonElement,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notEquals',
    },
  },
  notHasAttribute: {
    element: buttonElement,
    assertionAttribute: 'not-id',
    assertionValue: 'not-button',
    assertionType: {
      type: 'notHasAttribute',
    },
  },
  pageNotToHaveTitle: {
    assertionValue: 'NotIntegration',
    assertionType: {
      type: 'notToHaveTitle',
    },
  },
  pageNotToHaveURL: {
    assertionValue: 'https://not.master.d33h0yvwek6xsp.amplifyapp.com/',
    assertionType: {
      type: 'notToHaveURL',
    },
  },
  buttonNotToHaveLength: {
    element: buttonElement,
    assertionValue: '2',
    assertionType: {
      type: 'notToHaveLength',
    },
  },
  buttonNotToBeDisabledFrame: {
    element: buttonElement,
    assertionValue: '2',
    assertionType: {
      type: 'notToBeDisabled',
    },
  },
  buttonNotToBeEnabled: {
    element: disabledButtonElement,
    assertionType: {
      type: 'notToBeEnabled',
    },
  },
  buttonNotToBeHiddenFrame: {
    assertionType: {
      type: 'notToBeHidden',
    },
  },
}

const generatedAssertions = (
  values: Record<string, any>,
  template: Array<Record<string, any>>,
) =>
  Object.entries(values).map(([name, value]) => {
    const [redirect, assertion] = [...template]

    return [name, [redirect, { ...assertion, ...value }]]
  })

export default [
  ...generatedAssertions(values, assertionTemplate),
  ...generatedAssertions(notValues, assertionTemplate),
  ...generatedAssertions(frameValues, framedAssertionTemplate),
  ...generatedAssertions(frameNotValues, framedAssertionTemplate),
]
