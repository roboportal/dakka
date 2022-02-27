/* eslint-disable quotes */
import { IEventBlock, ISelector } from '@/store/eventRecorderSlice'
import { exportOptions, INTERACTIVE_TAGS } from '../constants'
import { assertionTypes } from '@/constants/assertion'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'
import { selectorTypes } from '../selectorTypes'
import { ASSERTION } from '../../../constants/actionTypes'
import { resize } from '../../../constants/browserEvents'

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
    default: () => '',
  }

  private getGoToTestedPage(url = '', innerWidth = 0, innerHeight = 0) {
    return `cy.viewport(${innerWidth}, ${innerHeight})
    cy.visit('${url}', { failOnStatusCode: false })\n`
  }

  private setViewPort(innerWidth = 0, innerHeight = 0) {
    return `    cy.viewport(${innerWidth}, ${innerHeight})\n`
  }

  private getWrapper(testName: string, content: string) {
    return `
describe('${testName}', () => {
  it('${testName}', () => {
    ${content}
  })
})`
  }

  private expectMethodsMap: Record<
    string,
    ({
      selector,
      assertionValue,
      assertionAttribute,
    }: {
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
    }) => string
  > = {
    [assertionTypes.toHaveTitle]: ({ assertionValue }) => {
      return `    cy.title().should('eq', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue }) => {
      return `    cy.title().should('not.eq', '${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue }) => {
      return `    cy.url().should('eq', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue }) => {
      return `    cy.url().should('not.eq', '${assertionValue}')\n`
    },

    [assertionTypes.toBeChecked]: ({ selector }) => {
      return `    cy.${selector}.should('be.checked')\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector }) => {
      return `    cy.${selector}.should('not.be.checked')\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue }) => {
      return `    cy.${selector}.should('contain.text', '${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({ selector, assertionValue }) => {
      return `    cy.${selector}.should('not.contain.text', '${assertionValue}')\n`
    },

    [assertionTypes.equals]: ({ selector, assertionValue }) => {
      return `    cy.${selector}.should('have.text', '${assertionValue}')\n`
    },

    [assertionTypes.notEquals]: ({ selector, assertionValue }) => {
      return `    cy.${selector}.should('not.have.text', '${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector }) => {
      return `    cy.${selector}.should('exist')\n`
    },

    [assertionTypes.notInDocument]: ({ selector }) => {
      return `    cy.${selector}.should('not.exist')\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector }) => {
      return `    cy.${selector}.should('be.disabled')\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector }) => {
      return `    cy.${selector}.should('not.be.disabled')\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector }) => {
      return `    cy.${selector}.should('be.enabled')\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector }) => {
      return `    cy.${selector}.should('not.be.enabled')\n`
    },

    [assertionTypes.toBeHidden]: ({ selector }) => {
      return `    cy.${selector}.should('be.hidden')\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector }) => {
      return `  cy.${selector}.should('not.be.hidden')\n`
    },

    [assertionTypes.toBeVisible]: ({ selector }) => {
      return `    cy.${selector}.should('be.visible')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector }) => {
      return `    cy.${selector}.should('not.be.visible')\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      return `    cy.${selector}.should('have.attr', '${assertionAttribute}', '${assertionValue}')\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      return `    cy.${selector}.should('not.have.attr', '${assertionAttribute}', '${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({ selector, assertionValue }) => {
      return `    cy.${selector}.should('have.length', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveLength]: ({ selector, assertionValue }) => {
      return `    cy.${selector}.should('not.have.length', '${assertionValue}')\n`
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

    return `get('${normalizeString(value)}')`
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
        acc += `    cy.${selector}${firstSelector}${action}\n`
      }

      if (it.type === ASSERTION) {
        acc += this.expectMethodsMap[it?.assertionType?.type as assertionTypes](
          {
            selector: `${this.generateSelector(it?.element)}${firstSelector}`,
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
          },
        )
      }

      if (it.type === resize) {
        acc += this.setViewPort(it.innerWidth, it.innerHeight)
      }

      return acc
    }, '')
  }

  private getContent(events: IEventBlock[]) {
    const [{ url, innerWidth, innerHeight }, ...restEvents] = events
    return `${this.getGoToTestedPage(
      url,
      innerWidth,
      innerHeight,
    )}${this.serializeRecordedEvents(restEvents)}`
  }

  process(events: IEventBlock[]) {
    const firstRedirect = events[0]
    const testName = `Testing ${firstRedirect.url}`

    return this.getWrapper(testName, this.getContent(events))
  }
}
