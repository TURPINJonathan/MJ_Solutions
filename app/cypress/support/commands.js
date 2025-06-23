Cypress.Commands.add('login', () => {
  window.localStorage.setItem('token', 'fake-jwt-token');
	window.localStorage.setItem('refreshToken', 'fake-refresh-token');
});