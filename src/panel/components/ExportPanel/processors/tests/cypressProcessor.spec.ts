import { CypressProcessor } from '../cypressProcessor'
import { IEventBlock } from '@/store/eventRecorderSlice'
import events from './events.json'

describe('cypressProcessor', () => {
  it('generates correct test file', () => {
    const result = new CypressProcessor().process(events as IEventBlock[])
    const expected = `
describe('Testing https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8', () => {
  it('Testing https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8', () => {
    cy.viewport(1440, 629)
    cy.visit('https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8', { failOnStatusCode: false })
    cy.get('input[aria-label="Search"]').click()
    cy.get('input[aria-label="Search"]').type('ff')
    cy.get('div#rcnt').dblclick()
    cy.viewport(1309, 539)
    cy.get('input[aria-label="Search"]').type('{backspace}')
    cy.get('input[aria-label="Search"]').should('have.attr', 'class', 'gLFyf gsfi')

  })
})`
    expect(result).toStrictEqual(expected)
  })
})
