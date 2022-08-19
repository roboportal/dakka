/* eslint-disable quotes */
import { exportOptions } from '@roboportal/constants/exportOptions'
import { assertionTypes } from '@roboportal/constants/assertion'
import { selectorTypes } from '@roboportal/constants/selectorTypes'
import {
  NON_INTERACTIVE_TAGS,
  TAG_NAMES,
  VALID_NAMES,
  CLASSNAME_SELECTOR,
} from '@roboportal/constants/elementTypes'
import { ASSERTION } from '@roboportal/constants/actionTypes'
import { fileUpload, redirect } from '@roboportal/constants/browserEvents'
import { normalizeString } from '@roboportal/utils/normalizer'

import { IEventBlock, ITestCase } from '@roboportal/types'

import { ExportProcessor } from './abstractProcessor'

const keyDowns: Record<string, string> = {
  Backspace: 'Press Backspace key',
  Delete: 'Press Delete key',
  Enter: 'Press Enter key',
  Shift: 'Press Shift key',
}

export class DescribeProcessor extends ExportProcessor {
  type = exportOptions.describe
  fileName = 'describe.txt'

  private methodsMap: Record<string, (it: IEventBlock) => string> = {
    mouseClick: () => 'Click',
    dblclick: () => 'Double click',
    keyboard: ({ key }) => `Type '${normalizeString(key ?? '')}' in`,
    keydown: ({ key }) => keyDowns[key ?? ''] ?? '',
    keyup: ({ key }) => keyDowns[key ?? ''] ?? '',
    [fileUpload]: ({ files }) => {
      if (!files) {
        return ''
      }
      return `selectFile ${files.map((f) => `'./${f.name}'`).join(', ')})`
    },
    default: () => '',
  }

  private getGoToTestedPage(url = '', step: number, isRedirect?: boolean) {
    if (isRedirect) {
      return `Step ${step}: User is redirected to ${url}`
    }

    return `Step ${step}: visit url '${url}'`
  }

  private getWrapper(content: string) {
    return `${content}`
  }

  private expectMethodsMap: Record<
    string,
    ({
      elementName,
      selector,
      assertionValue,
      assertionAttribute,
    }: {
      elementName?: string
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
    }) => string
  > = {
    [assertionTypes.toHaveTitle]: ({ assertionValue }) => {
      return `Page title should equal '${assertionValue}'\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue }) => {
      return `Page title should not equal '${assertionValue}'\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue }) => {
      return `Page url should equal '${assertionValue}'\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue }) => {
      return `Page url should not equal '${assertionValue}'\n`
    },

    [assertionTypes.toBeChecked]: ({ elementName, selector }) => {
      return `${elementName} checkbox ${selector} should be checked\n`
    },

    [assertionTypes.notToBeChecked]: ({ elementName, selector }) => {
      return `${elementName} checkbox ${selector} should not be checked\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue }) => {
      return `'${assertionValue}' ${selector} should be shown\n`
    },

    [assertionTypes.notContains]: ({ selector, assertionValue }) => {
      return `'${assertionValue}' ${selector} should not be shown\n`
    },

    [assertionTypes.equals]: ({ elementName, selector, assertionValue }) => {
      return `${elementName} ${selector} should have text '${assertionValue}'\n`
    },

    [assertionTypes.notEquals]: ({ elementName, selector, assertionValue }) => {
      return `${elementName} ${selector} should not have text '${assertionValue}'\n`
    },

    [assertionTypes.inDocument]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should be shown\n`
    },

    [assertionTypes.notInDocument]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should not be shown\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector, elementName }) => {
      return `${elementName} ${selector} should be disabled\n`
    },

    [assertionTypes.notToBeDisabled]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should not be disabled\n`
    },

    [assertionTypes.toBeEnabled]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should be enabled\n`
    },

    [assertionTypes.notToBeEnabled]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should not be enabled\n`
    },

    [assertionTypes.toBeHidden]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should be hidden\n`
    },

    [assertionTypes.notToBeHidden]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should not be hidden\n`
    },

    [assertionTypes.toBeVisible]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should be visible\n`
    },

    [assertionTypes.notToBeVisible]: ({ elementName, selector }) => {
      return `${elementName} ${selector} should not be visible\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      elementName,
    }) => {
      return `${elementName} ${selector} should have attribute '${assertionAttribute}' with value '${assertionValue}'\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      elementName,
    }) => {
      return `${elementName} ${selector} should not have attribute '${assertionAttribute}', '${assertionValue}'\n`
    },

    [assertionTypes.toHaveLength]: ({
      elementName,
      selector,
      assertionValue,
    }) => {
      return `${elementName} ${selector} should have length '${assertionValue}'\n`
    },

    [assertionTypes.notToHaveLength]: ({
      elementName,
      selector,
      assertionValue,
    }) => {
      return `${elementName} ${selector} should not have length '${assertionValue}'\n`
    },
  }

  private getLabeledDescription(it: IEventBlock | null | undefined) {
    const name = it?.selectedSelector?.name || ''
    const tagName = it?.selectedSelector?.tagName || ''
    const rawValue = it?.selectedSelector?.rawValue || ''
    const ariaLabel = (it?.selectedSelector?.ariaLabel || '').trim()

    const isSelect = rawValue === 'listbox' && name === 'role'
    const isNonInteractiveTag = NON_INTERACTIVE_TAGS.indexOf(tagName) > -1

    if (isSelect) {
      return `'${ariaLabel}' dropdown `
    }

    return isNonInteractiveTag
      ? `'${ariaLabel}' `
      : `'${ariaLabel}' ${tagName} `
  }

  private getPlaceholderDescription(it: IEventBlock | null | undefined) {
    const tagName = it?.selectedSelector?.tagName || ''
    const rawValue = it?.selectedSelector?.rawValue || ''

    return `${tagName} with "${rawValue}" placeholder `
  }

  private getTagName(it: IEventBlock | null | undefined) {
    const tagName = it?.selectedSelector?.tagName || ''

    return TAG_NAMES[tagName] ?? tagName
  }

  private getStepDescription(it: IEventBlock | null | undefined) {
    const tagName = this.getTagName(it)
    const rawValue = it?.selectedSelector?.rawValue || ''
    const textContent = (it?.selectedSelector?.textContent || '').trim()
    const ariaLabel = it?.selectedSelector?.ariaLabel || ''
    const placeholder = it?.selectedSelector?.placeholder || ''
    const name = it?.selectedSelector?.name
    const isNonInteractiveTag = NON_INTERACTIVE_TAGS.indexOf(tagName) > -1

    if (name === CLASSNAME_SELECTOR) {
      const value = it?.validSelectors?.find((selector) =>
        VALID_NAMES.find((item) => item === selector.name),
      )

      const tag =
        rawValue == tagName || isNonInteractiveTag
          ? ''
          : TAG_NAMES[tagName] ?? tagName

      return `${value?.rawValue ?? tagName} ${tag} `
    }

    if (ariaLabel) {
      return this.getLabeledDescription(it)
    }

    if (placeholder) {
      return this.getPlaceholderDescription(it)
    }

    if (isNonInteractiveTag) {
      return `'${textContent || rawValue}' `
    }

    return `"${rawValue}" ${rawValue == tagName ? '' : tagName} `
  }

  private generateSelector(
    it: IEventBlock | null | undefined,
    isIncludeSelector: boolean,
  ) {
    const name = it?.selectedSelector?.name
    const value = it?.selectedSelector?.value

    if (!value || name === selectorTypes.text || !isIncludeSelector) {
      return ''
    }

    return `(${value})`
  }

  private serializeRecordedEvents(
    events: IEventBlock[],
    step: number,
    isIncludeSelector: boolean,
  ) {
    return events.reduce((acc, it, index) => {
      const elementName = this.getStepDescription(it)
      const selector = this.generateSelector(it, isIncludeSelector)

      const action =
        this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)

      if (action) {
        acc += `Step ${index + step}: ${action} ${elementName}${selector}\n`
      }

      if (it.type === ASSERTION) {
        const elementName = this.getStepDescription(it?.element)

        const result = this.expectMethodsMap[
          it?.assertionType?.type as assertionTypes
        ]({
          selector: selector ? `(${selector})` : '',
          elementName: `${elementName}`,
          assertionValue: it.assertionValue,
          assertionAttribute: it.assertionAttribute,
        })
        acc += `\nExpected Result: ${result}`
      }

      if (it.type === redirect) {
        acc += `${this.getGoToTestedPage(it.url, step + index, true)}\n`
      }

      return acc
    }, '')
  }

  private getContent(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
    isIncludeSelector: boolean,
  ) {
    return testCaseMeta.its
      .map((it) => {
        const events = testCaseEvents[it.id]
        const name = it.value || ''
        return this.getIt(name, events, isIncludeSelector)
      })
      .join('\n\n  ')
  }

  private getIt(
    name: string,
    events: IEventBlock[],
    isIncludeSelector: boolean,
  ) {
    const [{ url }, ...restEvents] = events
    return `Test description:\n${name}\n\nSteps to reproduce:\n
${this.getGoToTestedPage(url, 1)}
${this.serializeRecordedEvents(restEvents, 2, isIncludeSelector)}
`
  }

  process(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
    isIncludeSelector: boolean,
  ) {
    return this.getWrapper(
      this.getContent(testCaseEvents, testCaseMeta, isIncludeSelector),
    )
  }
}
