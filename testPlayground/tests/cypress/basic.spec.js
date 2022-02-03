describe('Testing https://javascript.info/promise-chaining', () => {
  it('Testing https://javascript.info/promise-chaining', () => {
    cy.visit('https://javascript.info/promise-chaining')
    cy.get('.sitetoolbar__login').click()
    cy.contains('button', 'Log in').click()
    cy.contains('Please enter email.').should('exist')
    cy.contains('Please enter password.').should('exist')
    cy.contains('button', 'Forgot?').click()
    cy.contains('button', 'Recovery password').should('be.enabled')
  })
})
