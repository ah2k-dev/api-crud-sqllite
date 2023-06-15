describe('1st', () => {
  it('passes', () => {
    cy.visit(' http://192.168.1.133:3000/database')
    cy.wait(2000)
    cy.visit(' http://192.168.1.133:3000/database/tarif.db3x')
    cy.wait(2000)
    
    cy.scrollTo('center')
    cy.wait(2000)
    cy.scrollTo('bottom')
    cy.wait(2000)
    cy.scrollTo('center')
    cy.wait(2000)
    cy.scrollTo('top')
    cy.wait(2000)
    cy.contains('View').click()
    cy.wait(2000)
    cy.scrollTo('500px')
    cy.wait(2000)
   cy.go('back')
   
   //cy.get('select').select('tarif.db3x').focus()
    
    })
  
})

