describe('Back-Office Login', () => {
  beforeEach(() => {
    cy.visit('/login', { failOnStatusCode: false });
		cy.clearLocalStorage();
  });

	it('should allow a user to log in with valid credentials', () => {
		cy.intercept('POST', 'http://localhost:8080/auth/login', {
			statusCode: 200,
			body: {
				token: 'fake-jwt-token',
				refreshToken: 'fake-refresh-token',
        user: {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ROLE_ADMIN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
			}
		}).as('login');

		cy.get('.backdrop').should('not.exist');
		cy.get('input[name="email"]').type('admin@example.com');
		cy.get('input[name="password"]').type('Test1234!');
		cy.get('button[type="submit"]').should('not.be.disabled').click();

		cy.wait('@login');
		cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token');
      expect(win.localStorage.getItem('refreshToken')).to.eq('fake-refresh-token');
    });
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

		cy.window().then((win) => {
			expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token');
			expect(win.localStorage.getItem('refreshToken')).to.eq('fake-refresh-token');
		});
	});

	it('should not store refreshToken if login fails', () => {
		cy.intercept('POST', 'http://localhost:8080/auth/login', {
			statusCode: 401,
			body: {}
		}).as('loginFail');

		cy.get('input[name="email"]').type('admin@example.com');
		cy.get('input[name="password"]').type('Test1234!');
		cy.get('button[type="submit"]').should('not.be.disabled').click();

		cy.wait('@loginFail');
		cy.url().should('include', '/login');

		cy.window().then((win) => {
			expect(win.localStorage.getItem('refreshToken')).to.be.null;
		});
	});
	
  it('should have user in store after login (if store is exposed)', () => {
    cy.intercept('POST', 'http://localhost:8080/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        refreshToken: 'fake-refresh-token',
        user: {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ROLE_ADMIN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }).as('login');

    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('Test1234!');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@login');
    cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      if (win.store) {
        win.store.select('user').subscribe((userState) => {
          expect(userState.user.email).to.eq('admin@example.com');
        });
      }
    });
  });
});