describe('Testing https://www.roboportal.io/login/', () => {
  it('Testing https://www.roboportal.io/login/', () => {
    cy.visit('https://www.roboportal.io/login/', { failOnStatusCode: false })
    cy.contains('Cancel').click()
    cy.get('input[name="email"]').click()
    cy.get('input[name="email"]').type('g')
    cy.get('input[name="email"]').type('gg')
    cy.get('input[name="password"]').click()
    cy.get('input[name="password"]').type('g')
    cy.get('div#root').click()
    cy.contains('Invalid email').should('contain.text', 'Invalid email')
    cy.contains('Password should contain min 8 characters').should(
      'contain.text',
      'Password should contain min 8 characters',
    )
  })
})
