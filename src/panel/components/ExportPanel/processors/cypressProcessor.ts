import { IEventBlock, IEventPayload } from 'store/eventRecorderSlice'
import { exportOptions } from '../constants'
import { assertionTypes } from 'constants/assertion'
import { selectorsFactoryMap, selectorTypes } from '../exportProcessor'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'

export class CypressProcessor extends ExportProcessor {
  type = exportOptions.cypress
  fileName = 'cypress.spec.js'

  private methodsMap: Record<string, (it: IEventPayload) => string> = {
    mouseClick: () => '.click()',
    keyboard: ({ key }) => `.type('${normalizeString(key ?? '')}')`,
    default: () => '',
  }

  private getGoToTestedPage(url: string) {
    return `cy.visit('${url}')`
  }

  private getWrapper(testName: string, content: string) {
    return `describe('${testName}', () => {
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
      return `  cy.title().should('eq', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue }) => {
      return `  cy.title().should('not.eq', '${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue }) => {
      return `  cy.url().should('eq', '${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue }) => {
      return `  cy.url().should('not.eq', '${assertionValue}')\n`
    },

    [assertionTypes.toBeChecked]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('be.checked')\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.be.checked')\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('contain.text', ${assertionValue})\n`
    },

    [assertionTypes.notContains]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.contain.text', ${assertionValue})\n`
    },

    [assertionTypes.inDocument]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('exist')\n`
    },

    [assertionTypes.notInDocument]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.exist')\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('be.disabled')\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.be.disabled')\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('be.enabled')\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.be.enabled')\n`
    },

    [assertionTypes.toBeHidden]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('be.hidden')\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.be.hidden')\n`
    },

    [assertionTypes.toBeVisible]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('be.visible')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.be.visible')\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('have.attr', ${assertionAttribute}, ${assertionValue})\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.have.attr', ${assertionAttribute}, ${assertionValue})\n`
    },

    [assertionTypes.toHaveLength]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('have.length', ${assertionValue})\n`
    },

    [assertionTypes.notToHaveLength]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  cy.get(${normalizedSelector}).should('not.have.length', ${assertionValue})\n`
    },
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      if (it.selectedSelector) {
        const selector = selectorsFactoryMap[
          it.selectedSelector.name as selectorTypes
        ](it.selectedSelector.value)
        acc += `  cy.get('${normalizeString(selector)}')${
          this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)
        }\n`
      }

      if (it.type === 'Assertion') {
        const element = it.element
        if (element) {
          const selector = selectorsFactoryMap[
            element?.selectedSelector?.name as selectorTypes
          ](element?.selectedSelector?.value ?? '')
          acc += this.expectMethodsMap[
            it?.assertionType?.type as assertionTypes
          ]({
            selector,
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
          })
        }
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
