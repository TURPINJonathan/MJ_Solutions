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
          contractEndAt: '2025-12-31',
          contractStartAt: '2025-01-01',
          type: 'CDI',
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
    cy.get('input[name="compagny-name"]').type('A', { force: true });
    cy.get('input[name="compagny-website"]').type('not-a-url', { force: true });
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[name="compagny-name"]').clear({ force: true }).type('MJ Solutions', { force: true });
    cy.get('input[name="compagny-website"]').clear({ force: true }).type('https://mj-solutions.fr', { force: true });
    cy.get('input[name="compagny-color"]').invoke('val', '#123456').trigger('input');
    cy.get('select[name="compagny-type"]').select('CDI');
    cy.get('input[name="compagny-contract-start-at"]').type('2025-01-01', { force: true });
    cy.get('input[name="compagny-contract-end-at"]').type('2025-12-31', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description de test', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should create a compagny WITHOUT contact', () => {
    cy.intercept('POST', '**/compagny/create').as('createCompagny');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Compagnie Sans Contact', { force: true });
    cy.get('input[name="compagny-website"]').type('https://sanscontact.fr', { force: true });
    cy.get('input[name="compagny-color"]').invoke('val', '#aabbcc').trigger('input');
    cy.get('select[name="compagny-type"]').select('PROSPECT');
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description sans contact', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createCompagny').its('request.body').should((body) => {
      expect(body.contacts).to.have.length(0);
      expect(body.type).to.eq('PROSPECT');
      expect(body.contractStartAt == null).to.be.true;
      expect(body.contractEndAt == null).to.be.true;
    });
  });

  it('should create a compagny WITH ONE contact', () => {
    cy.intercept('POST', '**/compagny/create').as('createCompagny');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Compagnie Un Contact', { force: true });
    cy.get('input[name="compagny-website"]').type('https://uncontact.fr', { force: true });
    cy.get('input[name="compagny-color"]').invoke('val', '#bbccdd').trigger('input');
    cy.get('select[name="compagny-type"]').select('CDI');
    cy.get('input[name="compagny-contract-start-at"]').type('2025-01-01', { force: true });
    cy.get('input[name="compagny-contract-end-at"]').type('2025-12-31', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description un contact', { force: true });
    cy.get('app-button[color="accent"]').click({ force: true });
    cy.get('input[name="contact-lastname"]').last().type('Dupont', { force: true });
    cy.get('input[name="contact-firstname"]').last().type('Jean', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createCompagny').its('request.body').should((body) => {
      expect(body.contacts).to.have.length(1);
      expect(body.contacts[0].lastname).to.eq('Dupont');
      expect(body.contacts[0].firstname).to.eq('Jean');
      expect(body.type).to.eq('CDI');
      expect(body.contractStartAt).to.exist;
      expect(body.contractEndAt).to.exist;
    });
  });

  it('should create a compagny WITH MULTIPLE contacts', () => {
    cy.intercept('POST', '**/compagny/create').as('createCompagny');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Compagnie Multi Contacts', { force: true });
    cy.get('input[name="compagny-website"]').type('https://multicontacts.fr', { force: true });
    cy.get('input[name="compagny-color"]').invoke('val', '#ccddee').trigger('input');
    cy.get('select[name="compagny-type"]').select('FREELANCE');
    cy.get('input[name="compagny-contract-start-at"]').type('2025-02-01', { force: true });
    cy.get('input[name="compagny-contract-end-at"]').type('2025-12-31', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Description multi contacts', { force: true });
    // Premier contact
    cy.get('app-button[color="accent"]').click({ force: true });
    cy.get('input[name="contact-lastname"]').last().type('Martin', { force: true });
    cy.get('input[name="contact-firstname"]').last().type('Alice', { force: true });
    // Deuxième contact
    cy.get('app-button[color="accent"]').click({ force: true });
    cy.get('input[name="contact-lastname"]').last().type('Durand', { force: true });
    cy.get('input[name="contact-firstname"]').last().type('Paul', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createCompagny').its('request.body').should((body) => {
      expect(body.contacts).to.have.length(2);
      expect(body.contacts[0].lastname).to.eq('Martin');
      expect(body.contacts[1].lastname).to.eq('Durand');
      expect(body.type).to.eq('FREELANCE');
      expect(body.contractStartAt).to.exist;
      expect(body.contractEndAt).to.exist;
    });
  });

  it('should show error toast if creation fails', () => {
    cy.intercept('POST', '**/compagny/create', {
      statusCode: 500,
      body: {}
    }).as('createCompagnyFail');

    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="compagny-name"]').type('Erreur Compagnie', { force: true });
    cy.get('input[name="compagny-website"]').type('https://fail.fr', { force: true });
    cy.get('input[name="compagny-color"]').invoke('val', '#ff0000').trigger('input');
    cy.get('select[name="compagny-type"]').select('CDI');
    cy.get('input[name="compagny-contract-start-at"]').type('2025-01-01', { force: true });
    cy.get('input[name="compagny-contract-end-at"]').type('2025-12-31', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Erreur description', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });

    cy.wait('@createCompagnyFail');
    cy.get('.toast-error,.toast--error').should('exist');
  });
});