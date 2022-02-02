import { IEventBlock, IEventPayload } from 'store/eventRecorderSlice'
import { exportOptions } from '../constants'
import { assertionTypes } from 'constants/assertion'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'
import { selectorTypes } from '../selectorTypes'

export const selectorsCypressFactoryMap: Record<
  selectorTypes,
  (v: string) => string
> = {
  [selectorTypes.role]: (v) => `get('[role="${v}"]')`,
  [selectorTypes.labelText]: (v) => `get('[aria-label="${v}"]')`,
  [selectorTypes.placeholder]: (v) => `get('[placeholder="${v}"]')`,
  [selectorTypes.text]: (v) => `contains('${v}')`,
  [selectorTypes.className]: (v) => `get('.${v}')`,
  [selectorTypes.elementId]: (v) => `get('#${v}')`,
  [selectorTypes.testId]: (v) => `get('[data-test-id="${v}"]')`,
  [selectorTypes.uniquePath]: (v) => `get('${v}')`,
}

export class CypressProcessor extends ExportProcessor {
  type = exportOptions.cypress
  fileName = 'cypress.spec.js'

  private methodsMap: Record<string, (it: IEventPayload) => string> = {
    mouseClick: () => '.click()',
    keyboard: ({ key }) => `.type('${normalizeString(key ?? '')}')`,
    default: () => '',
  }

  private getGoToTestedPage(url: string) {
    return `cy.visit('${url}')\n`
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
      return `      cy.${selector}.should('have.attr', '${assertionAttribute}', '${assertionValue}')\n`
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

  private generateSelector(it: IEventPayload) {
    if (!it.selectedSelector) {
      return ''
    }

    if (it.selectedSelector.name.startsWith('data-')) {
      return `get('[${it.selectedSelector.name}="${it.selectedSelector.value}"]')`
    }

    return selectorsCypressFactoryMap[
      it.selectedSelector.name as selectorTypes
    ](it.selectedSelector.value)
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      const selector = this.generateSelector(it)

      if (selector) {
        acc += `    cy.${selector}${
          this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)
        }\n`
      }

      if (it.type === 'Assertion' && it.element) {
        const selector = this.generateSelector(it.element)

        acc += this.expectMethodsMap[it?.assertionType?.type as assertionTypes](
          {
            selector,
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
          },
        )
      }

      return acc
    }, '')
  }

  private getContent(events: IEventBlock[]) {
    const [firstEvent, ...restEvents] = events
    return `${this.getGoToTestedPage(
      firstEvent.url ?? '',
    )}${this.serializeRecordedEvents(restEvents)}`
  }

  process(events: IEventBlock[]) {
    const firstRedirect = events[0]
    const testName = `Testing ${firstRedirect.url}`

    return this.getWrapper(testName, this.getContent(events))
  }
}
