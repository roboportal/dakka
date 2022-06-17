/* eslint-disable quotes */
import { exportOptions } from '@roboportal/constants/exportOptions'
import { selectorTypes } from '@roboportal/constants/selectorTypes'
import { INTERACTIVE_TAGS } from '@roboportal/constants/interactiveTags'
import { assertionTypes } from '@roboportal/constants/assertion'
import { ASSERTION } from '@roboportal/constants/actionTypes'
import {
  fileUpload,
  resize,
  redirect,
} from '@roboportal/constants/browserEvents'

import { normalizeString } from '@roboportal/utils/normalizer'

import { IEventBlock, ISelector, ITestCase } from '@roboportal/types'

import { ExportProcessor } from './abstractProcessor'

const keyDowns: Record<string, string> = {
  Backspace: ".type('{backspace}')",
  Delete: ".type('{delete}')",
  Enter: ".type('{enter}')",
  // Tab: ".type('{tab}')", not supported yet https://github.com/cypress-io/cypress/issues/311
  Shift: ".type('{shift}')",
}

export class CypressProcessor extends ExportProcessor {
  type = exportOptions.cypress
  fileName = 'cypress.spec.js'

  private methodsMap: Record<string, (it: IEventBlock) => string> = {
    mouseClick: () => '.click()',
    dblclick: () => '.dblclick()',
    keyboard: ({ key }) => `.type('${normalizeString(key ?? '')}')`,
    keydown: ({ key }) => keyDowns[key ?? ''] ?? '',
    keyup: ({ key }) => keyDowns[key ?? ''] ?? '',
    [fileUpload]: ({ files }) => {
      if (!files) {
        return ''
      }
      return `.selectFile([${files.map((f) => `'./${f.name}'`).join(', ')}])`
    },
    default: () => '',
  }

  private getGoToTestedPage(url = '', innerWidth = 0, innerHeight = 0) {
    return `cy.viewport(${innerWidth}, ${innerHeight})
    cy.visit('${url}', { failOnStatusCode: false })`
  }

  private setViewPort(innerWidth = 0, innerHeight = 0) {
    return `    cy.viewport(${innerWidth}, ${innerHeight})\n`
  }

  private getWrapper(testName: string, content: string) {
    return `describe('${testName}', () => {
  ${content}
})`
  }

  private expectMethodsMap: Record<
    string,
    ({
      selector,
      assertionValue,
      assertionAttribute,
      context,
      iframeSelector,
    }: {
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
      context: string
      iframeSelector: string
    }) => string
  > = {
    [assertionTypes.toHaveTitle]: ({
      assertionValue,
      context,
      iframeSelector,
    }) => {
      if (context === 'cy') {
        return `    ${context}.title().should('eq', '${assertionValue}')\n`
      }
      return `    cy.${iframeSelector}.its('0.contentDocument.documentElement.title').should('eq', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({
      assertionValue,
      context,
      iframeSelector,
    }) => {
      if (context === 'cy') {
        return `    ${context}.title().should('not.eq', '${assertionValue}')\n`
      }
      return `    cy.${iframeSelector}.its('0.contentDocument.documentElement.title').should('not.eq', '${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({
      assertionValue,
      context,
      iframeSelector,
    }) => {
      if (context === 'cy') {
        return `    ${context}.url().should('eq', '${assertionValue}')\n`
      }
      return `    cy.${iframeSelector}.its('0.contentDocument.documentElement.baseURI').should('eq', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({
      assertionValue,
      context,
      iframeSelector,
    }) => {
      if (context === 'cy') {
        return `    ${context}.url().should('not.eq', '${assertionValue}')\n`
      }
      return `    cy.${iframeSelector}.its('0.contentDocument.documentElement.baseURI').should('not.eq', '${assertionValue}')\n`
    },

    [assertionTypes.toBeChecked]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('be.checked')\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('not.be.checked')\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue, context }) => {
      if (selector?.indexOf('contains') !== -1) {
        return `    ${context}.${selector}\n`
      }
      return `    ${context}.${selector}.should('contain.text', '${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({ selector, assertionValue, context }) => {
      return `    ${context}.${selector}.should('not.contain.text', '${assertionValue}')\n`
    },

    [assertionTypes.equals]: ({ selector, assertionValue, context }) => {
      return `    ${context}.${selector}.should('have.text', '${assertionValue}')\n`
    },

    [assertionTypes.notEquals]: ({ selector, assertionValue, context }) => {
      return `    ${context}.${selector}.should('not.have.text', '${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector, context }) => {
      if (selector?.indexOf('contains') !== -1) {
        return `    ${context}.${selector}\n`
      }
      return `    ${context}.${selector}.should('exist')\n`
    },

    [assertionTypes.notInDocument]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('not.exist')\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('be.disabled')\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('not.be.disabled')\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('be.enabled')\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('not.be.enabled')\n`
    },

    [assertionTypes.toBeHidden]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('be.hidden')\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('not.be.hidden')\n`
    },

    [assertionTypes.toBeVisible]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('be.visible')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector, context }) => {
      return `    ${context}.${selector}.should('not.be.visible')\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      context,
    }) => {
      return `    ${context}.${selector}.should('have.attr', '${assertionAttribute}', '${assertionValue}')\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      context,
    }) => {
      return `    ${context}.${selector}.should('not.have.attr', '${assertionAttribute}', '${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({ selector, assertionValue, context }) => {
      return `    ${context}.${selector}.should('have.length', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveLength]: ({
      selector,
      assertionValue,
      context,
    }) => {
      return `    ${context}.${selector}.should('not.have.length', '${assertionValue}')\n`
    },
  }

  private generateSelector(it: IEventBlock | null | undefined) {
    if (!it?.selectedSelector || !it?.selectedSelector?.value) {
      return ''
    }

    const value = it.selectedSelector.value
    const name = it.selectedSelector.name
    const tagName = it.selectedSelector.tagName
    if (name === selectorTypes.text) {
      return INTERACTIVE_TAGS.includes(tagName ?? '')
        ? `contains('${tagName}', '${normalizeString(value)}')`
        : `contains('${normalizeString(value)}')`
    }

    const isInIframe = it.element?.isInIframe ?? it.isInIframe
    const getter = isInIframe ? 'find' : 'get'

    return `${getter}('${normalizeString(value)}')`
  }

  private generateIframeSelector(it: IEventBlock) {
    const defaultSelector = {
      name: 'src',
      tagName: 'iframe',
      value: `iframe[src="${it.url ?? it.element?.url}"]`,
    }
    return this.generateSelector({
      selectedSelector:
        it?.selectedIframeSelector ??
        it?.element?.selectedIframeSelector ??
        defaultSelector,
    } as IEventBlock)
  }

  private generateIframeInit(it: IEventBlock) {
    const selector = this.generateIframeSelector(it)

    return `
    frame = cy.${selector}.its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap)\n`
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      const selector = this.generateSelector(it)
      const firstSelector =
        it.selectedSelector && (it.selectedSelector as ISelector)?.length > 1
          ? '.first()'
          : ''

      const action =
        this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)

      if (selector && action) {
        const isInIframe = it.element?.isInIframe ?? it.isInIframe
        const context = isInIframe ? 'frame' : 'cy'
        if (isInIframe) {
          acc += this.generateIframeInit(it)
        }
        acc += `    ${context}.${selector}${firstSelector}${action}\n`
      }

      if (it.type === ASSERTION) {
        const isInIframe = it.element?.isInIframe ?? it.isInIframe
        const context = isInIframe ? 'frame' : 'cy'
        const shouldGenerateIframe =
          isInIframe &&
          ![
            assertionTypes.toHaveTitle,
            assertionTypes.notToHaveTitle,
            assertionTypes.toHaveURL,
            assertionTypes.notToHaveURL,
          ].includes(it?.assertionType?.type as assertionTypes)

        if (shouldGenerateIframe) {
          acc += this.generateIframeInit(it)
        }
        acc += this.expectMethodsMap[it?.assertionType?.type as assertionTypes](
          {
            selector: `${this.generateSelector(it?.element)}${firstSelector}`,
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
            context,
            iframeSelector: this.generateIframeSelector(it),
          },
        )
      }

      if (it.type === resize) {
        acc += this.setViewPort(it.innerWidth, it.innerHeight)
      }

      if (it.type === redirect) {
        acc += `    ${this.getGoToTestedPage(
          it.url,
          it.innerWidth,
          it.innerHeight,
        )}
`
      }

      return acc
    }, '')
  }

  private getIframeVariables(events: IEventBlock[]) {
    const shouldCreateVariables = events.some(
      (it) => it.element?.isInIframe ?? it.isInIframe,
    )

    if (shouldCreateVariables) {
      return `
    let frame = null`
    }
    return ''
  }

  private getContent(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
  ) {
    return testCaseMeta.its
      .map((it, index) => {
        const events = testCaseEvents[it.id]
        const name = it.value || `Test case ${index}`
        return this.getIt(name, events)
      })
      .join('\n\n  ')
  }

  private getIt(name: string, events: IEventBlock[]) {
    const [{ url, innerWidth, innerHeight }, ...restEvents] = events
    return `it('${name}', () => {
    ${this.getGoToTestedPage(url, innerWidth, innerHeight)}
${this.getIframeVariables(events)}
${this.serializeRecordedEvents(restEvents)}
  })`
  }

  process(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
  ) {
    const testName = testCaseMeta.describe || 'Dakka Cypress test'

    return this.getWrapper(
      testName,
      this.getContent(testCaseEvents, testCaseMeta),
    )
  }
}
