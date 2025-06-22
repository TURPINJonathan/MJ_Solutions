describe('Back-Office Login', () => {
  beforeEach(() => {
    cy.visit('/login', { failOnStatusCode: false });
  });

	it('should allow a user to log in with valid credentials', () => {
		cy.intercept('POST', 'http://localhost:8080/auth/login', {
			statusCode: 200,
			body: {
				token: 'fake-jwt-token',
				refreshToken: 'fake-refresh-token'
			}
		}).as('login');

		cy.get('.backdrop').should('not.exist');
		cy.get('input[name="email"]').type('admin@example.com');
		cy.get('input[name="password"]').type('Test1234!');
		cy.get('button[type="submit"]').should('not.be.disabled').click();

		cy.wait('@login');
		cy.url().should('include', '/dashboard');
	});

  it('should disable submit button if email is missing', () => {
    cy.get('input[name="password"]').type('motdepasse');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should disable submit button if password is missing', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should disable submit button if both fields are empty', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should mask password input', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });
});