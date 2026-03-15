describe('Landing Page', () => {
  it('should load the homepage', () => {
    cy.visit('/')
    cy.contains('Home') // Adjust based on actual content of your Home page
  })
})
