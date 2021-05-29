declare namespace Cypress {
  interface Chainable {
    /**
     * Clears all data stored in IndexedDB
     * @example cy.clearDB()
     */
    clearDB(): void
  }
}

Cypress.Commands.add('clearDB', () => {
  indexedDB.deleteDatabase('log')
})