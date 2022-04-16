const path = require('path')

const assertionTemplate = require(path.resolve(
  __dirname,
  '../../../mocks/assertionCombinations.json',
))

const framedAssertionTemplate = require(path.resolve(
  __dirname,
  '../../../mocks/framedAssertionCombinations.json',
))

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
}

const element = {
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

const notValues = {
  buttonNotContains: {
    element,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notContains',
    },
  },
  buttonNotEquals: {
    element,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notEquals',
    },
  },
  notHasAttribute: {
    element,
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
    element,
    assertionValue: '2',
    assertionType: {
      type: 'notToHaveLength',
    },
  },
}

const frameNotValues = {
  buttonNotContains: {
    element,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notContains',
    },
  },
  buttonNotEquals: {
    element,
    assertionValue: 'NotClick',
    assertionType: {
      type: 'notEquals',
    },
  },
  notHasAttribute: {
    element,
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
    element,
    assertionValue: '2',
    assertionType: {
      type: 'notToHaveLength',
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
