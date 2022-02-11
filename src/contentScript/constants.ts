export const SESSION_STORAGE_KEY = 'dakka_test_recorder_enabled'

export const VALID_ATTRIBUTES = [
  'href',
  'src',
  'placeholder',
  'alt',
  'aria-label',
  'for',
  'name',
  'ng-model',
  'type',
]

export const DATA_ATTRIBUTES = [
  'data-testid',
  'data-testId',
  'data-test-id',
  'data-test',
  'data-cy',
  'data-component-id',
  'data-componentid',
  'data-automation-id',
  'data-automationid',
  'data-QA',
  'data-qa',
  'data-name',
]

export const NON_INTERACTIVE_TAGS = [
  'svg',
  'img',
  'path',
  'span',
  'li',
  'ul',
  'ol',
  'area',
  'div',
]

export const TAGS = ['button', 'a', 'select', 'option', ...NON_INTERACTIVE_TAGS]
