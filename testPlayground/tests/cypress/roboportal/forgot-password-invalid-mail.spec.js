describe('Testing https://www.roboportal.io/login/', () => {
  it('Testing https://www.roboportal.io/login/', () => {
    cy.visit('https://www.roboportal.io/login/', { failOnStatusCode: false })
    cy.contains('Cancel').click()
    cy.contains('a', 'Forgot password?').click()
    cy.get('input[type="text"]').click()
    cy.get('input[type="text"]').type('test')
    cy.get('body').click()
    cy.contains('Invalid email').should('exist')
  })
})
