describe('Back-Office Compagny', () => {
  beforeEach(() => {
    cy.visit('/compagny', { failOnStatusCode: false });
    cy.clearLocalStorage();
  });

  it('should display the compagny list', () => {
    cy.intercept('GET', '**/compagny/all', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'MJ Solutions',
          website: 'https://mj-solutions.fr',
          color: '#123456',
          logo: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pictures: []
        }
      ]
    }).as('getCompagnies');

    cy.reload();
    cy.wait('@getCompagnies');
    cy.get('table').should('exist');
    cy.contains('MJ Solutions').should('exist');
    cy.contains('https://mj-solutions.fr').should('exist');
  });

  it('should open and close the create compagny modal', () => {
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('app-dialog').should('exist');
    cy.get('app-dialog .modal-header').should('exist');
    cy.get('app-dialog .modal-header app-button[color="danger"]').click({ force: true });
    cy.get('app-dialog .modal-content').should('have.class', 'out');
  });

  it('should validate required fields in the create compagny form', () => {
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('app-dialog').should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[name="compagny-name"]').type('A');
    cy.get('input[name="compagny-website"]').type('not-a-url');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[name="compagny-name"]').clear().type('MJ Solutions');
    cy.get('input[name="compagny-website"]').clear().type('https://mj-solutions.fr');
    cy.get('input[name="compagny-color"]').invoke('val', '#123456').trigger('input');
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description de test');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should create a compagny WITHOUT contact', () => {
    cy.intercept('POST', '**/compagny/create').as('createCompagny');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Compagnie Sans Contact');
    cy.get('input[name="compagny-website"]').type('https://sanscontact.fr');
    cy.get('input[name="compagny-color"]').invoke('val', '#aabbcc').trigger('input');
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description sans contact');
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createCompagny').its('request.body').should((body) => {
      expect(body.contacts).to.have.length(0);
    });
  });

  it('should create a compagny WITH ONE contact', () => {
    cy.intercept('POST', '**/compagny/create').as('createCompagny');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Compagnie Un Contact');
    cy.get('input[name="compagny-website"]').type('https://uncontact.fr');
    cy.get('input[name="compagny-color"]').invoke('val', '#bbccdd').trigger('input');
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description un contact');
    cy.get('app-button[color="accent"]').click({ force: true });
    cy.get('input[name="contact-lastname"]').last().type('Dupont');
    cy.get('input[name="contact-firstname"]').last().type('Jean');
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createCompagny').its('request.body').should((body) => {
      expect(body.contacts).to.have.length(1);
      expect(body.contacts[0].lastname).to.eq('Dupont');
      expect(body.contacts[0].firstname).to.eq('Jean');
    });
  });

  it('should create a compagny WITH MULTIPLE contacts', () => {
    cy.intercept('POST', '**/compagny/create').as('createCompagny');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Compagnie Multi Contacts');
    cy.get('input[name="compagny-website"]').type('https://multicontacts.fr');
    cy.get('input[name="compagny-color"]').invoke('val', '#ccddee').trigger('input');
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description multi contacts');
    // Premier contact
    cy.get('app-button[color="accent"]').click({ force: true });
    cy.get('input[name="contact-lastname"]').last().type('Martin');
    cy.get('input[name="contact-firstname"]').last().type('Alice');
    // Deuxième contact
    cy.get('app-button[color="accent"]').click({ force: true });
    cy.get('input[name="contact-lastname"]').last().type('Durand');
    cy.get('input[name="contact-firstname"]').last().type('Paul');
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createCompagny').its('request.body').should((body) => {
      expect(body.contacts).to.have.length(2);
      expect(body.contacts[0].lastname).to.eq('Martin');
      expect(body.contacts[1].lastname).to.eq('Durand');
    });
  });

  it('should show error toast if creation fails', () => {
    cy.intercept('POST', '**/compagny/create', {
      statusCode: 500,
      body: {}
    }).as('createCompagnyFail');

    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Erreur Compagnie');
    cy.get('input[name="compagny-website"]').type('https://fail.fr');
    cy.get('input[name="compagny-color"]').invoke('val', '#ff0000').trigger('input');
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Erreur description');
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });

    cy.wait('@createCompagnyFail');
    cy.get('.toast-error,.toast--error').should('exist');
  });
});