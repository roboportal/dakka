/* eslint-disable quotes */
import { exportOptions } from '@roboportal/constants/exportOptions'
import { assertionTypes } from '@roboportal/constants/assertion'
import { selectorTypes } from '@roboportal/constants/selectorTypes'
import {
  NON_INTERACTIVE_TAGS,
  TAG_NAMES,
  CLASSNAME_SELECTOR,
  VALID_SELECTOR_NAMES,
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
  private stepDescription = ''

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
      return `Step ${step}: User is redirected to ${url}.`
    }

    return `Step ${step}: visit url '${url}'.`
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

  private isNoneInteractiveTag(tag: string) {
    return NON_INTERACTIVE_TAGS.indexOf(tag) > -1
  }

  private getLabeledDescription(it: IEventBlock) {
    const name = it?.selectedSelector?.name || ''
    const tagName = it?.selectedSelector?.tagName || ''
    const rawValue = it?.selectedSelector?.rawValue || ''
    const ariaLabel = (it?.selectedSelector?.ariaLabel || '').trim()

    if (this.stepDescription || !ariaLabel) {
      return this
    }

    const isSelect = rawValue === 'listbox' && name === 'role'
    const isNonInteractiveTag = this.isNoneInteractiveTag(tagName)

    if (isSelect) {
      this.stepDescription = `"${ariaLabel}" dropdown`
      return this
    }

    this.stepDescription = isNonInteractiveTag
      ? `"${ariaLabel}"`
      : `"${ariaLabel}" ${tagName}`

    return this
  }

  private getNonInteractiveDescription(it: IEventBlock) {
    const rawValue = it?.selectedSelector?.rawValue || ''
    const textContent = (it?.selectedSelector?.textContent || '').trim()
    const tagName = it?.selectedSelector?.tagName || ''
    const isNonInteractiveTag = this.isNoneInteractiveTag(tagName)
    const elementContent = `"${textContent || rawValue}"`

    if (this.stepDescription) {
      return this
    }

    if (isNonInteractiveTag) {
      this.stepDescription = elementContent
      return this
    }

    this.stepDescription = `${elementContent} ${this.getTagName(it)}`
  }

  private getPlaceholderDescription(it: IEventBlock) {
    const tagName = it?.selectedSelector?.tagName || ''
    const rawValue = it?.selectedSelector?.rawValue || ''
    const placeholder = it?.selectedSelector?.placeholder || ''

    if (this.stepDescription) {
      return this
    }

    if (placeholder) {
      this.stepDescription = `${tagName} with "${rawValue}" placeholder`
      return this
    }

    return this
  }

  private getTagName(it: IEventBlock) {
    const tagName = it?.selectedSelector?.tagName || ''

    return TAG_NAMES[tagName] ?? tagName
  }

  private getClassNameDescription(it: IEventBlock) {
    if (this.stepDescription || !it.selectedSelector) {
      return this
    }

    const { name, rawValue = '' } = it.selectedSelector

    if (name === CLASSNAME_SELECTOR) {
      const tagName = this.getTagName(it)
      const isNonInteractiveTag = this.isNoneInteractiveTag(tagName)
      const tag =
        rawValue === tagName || isNonInteractiveTag
          ? ''
          : TAG_NAMES[tagName] ?? tagName

      const value = it?.validSelectors?.find((selector) =>
        VALID_SELECTOR_NAMES.find((item) => item === selector.name),
      )

      const description = value?.rawValue ?? tagName

      this.stepDescription =
        description === tag ? `${description}` : `${description} ${tag}`
    }

    return this
  }

  private getStepDescription(it: IEventBlock) {
    return this.getClassNameDescription(it)
      .getLabeledDescription(it)
      .getPlaceholderDescription(it)
      .getNonInteractiveDescription(it)
  }

  private resetStepDescription() {
    if (this.stepDescription) {
      this.stepDescription = ''
    }
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
      this.resetStepDescription()

      if (it) {
        this.getStepDescription(it)
      }

      const selector = this.generateSelector(it, isIncludeSelector)
      const action =
        this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)

      if (action) {
        acc += `Step ${index + step}: ${action} ${
          this.stepDescription
        }. ${selector}\n`
      }

      if (it.type === ASSERTION) {
        if (it?.element) {
          this.resetStepDescription()
          this.getStepDescription(it?.element)
        }

        const result = this.expectMethodsMap[
          it?.assertionType?.type as assertionTypes
        ]({
          selector: selector ? `(${selector})` : '',
          elementName: `${this.stepDescription}`,
          assertionValue: it.assertionValue,
          assertionAttribute: it.assertionAttribute,
        })
        acc += `\nExpected Result: ${result}\n`
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
