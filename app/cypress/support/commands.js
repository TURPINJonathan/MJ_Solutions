Cypress.Commands.add('login', () => {
  window.localStorage.setItem('token', 'fake-jwt-token');
});