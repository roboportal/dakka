describe('Testing https://www.roboportal.io/', () => {
  it('Testing https://www.roboportal.io/', () => {
    cy.visit('https://www.roboportal.io/')
    cy.contains('Cancel').click()
    cy.contains('a', 'login').click()
    cy.contains('a', 'Forgot password?').click()
    cy.get('input[type="text"]').click()
    cy.get('input[type="text"]').type('test@gmail.com')
    cy.get('button[type="submit"]').click()
    cy.contains('Confirmation email has been sent to your mailbox').should(
      'be.visible',
    )
    cy.contains('a', 'Go to main page').click()
  })
})
