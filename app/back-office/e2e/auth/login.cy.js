describe('Back-Office Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should allow a user to log in with valid credentials', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('motdepasse');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenue');
  });

  it('should show an error with invalid password', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should show an error with invalid email', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('motdepasse');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should require email field', () => {
    cy.get('input[name="password"]').type('motdepasse');
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should require password field', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Password is required').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should not allow login with empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should mask password input', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('should have a link to reset password', () => {
    cy.contains('Forgot password').should('have.attr', 'href').and('include', '/reset-password');
  });
});