Cypress.Commands.add('login', () => {
  window.localStorage.setItem('token', 'fake-jwt-token');
  cy.window().then((win) => {
    if (win.isTokenExpired) {
      cy.stub(win, 'isTokenExpired').returns(false);
    }
  });
});