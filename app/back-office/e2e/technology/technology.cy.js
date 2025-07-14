describe('Back-Office Technology', () => {
  beforeEach(() => {
    cy.visit('/technology', { failOnStatusCode: false });
    cy.clearLocalStorage();
  });

  it('should display the technology list', () => {
    cy.intercept('GET', '**/technology/all', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'React',
          description: 'Librairie JS',
          proficiency: 80,
          documentationUrl: 'https://react.dev',
          color: '#61dafb',
          types: ['FRONTEND'],
          isFavorite: true,
          logo: { id: 1, fileId: 1, fileName: 'react.png', url: '/img/react.png' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }).as('getTechnologies');

    cy.reload();
    cy.wait('@getTechnologies');
    cy.get('table').should('exist');
    cy.contains('React').should('exist');
    cy.contains('Frontend').should('exist');
  });

  it('should open and close the create technology modal', () => {
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('app-dialog').should('exist');
    cy.get('app-dialog .modal-header').should('exist');
    cy.get('app-dialog .modal-header app-button[color="danger"]').click({ force: true });
    cy.get('app-dialog .modal-content').should('have.class', 'out');
  });

  it('should validate required fields in the create technology form', () => {
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('app-dialog').should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[name="technology-name"]').type('A', { force: true });
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[name="technology-name"]').clear({ force: true }).type('React', { force: true });
    cy.get('input[name="technology-color"]').invoke('val', '#61dafb').trigger('input');
    cy.get('input[name="technology-documentation"]').type('https://react.dev', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Librairie JS', { force: true });
    cy.contains('.toggle-label', 'Frontend')
		.parents('app-toggle')
		.find('input[type="checkbox"]')
		.click({ force: true });
    cy.get('app-file-upload input[type="file"]').selectFile('cypress/fixtures/react.jpg', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should create a technology', () => {
		cy.intercept('POST', '**/files/upload', {
			statusCode: 200,
			body: {
				success: true,
				data: { id: 123 }
			}
		}).as('uploadLogo');
    cy.intercept('POST', '**/technology/create').as('createTechnology');
    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="technology-name"]').type('Vue.js', { force: true });
    cy.get('input[name="technology-color"]').invoke('val', '#42b883').trigger('input');
    cy.get('input[name="technology-documentation"]').type('https://vuejs.org', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Framework JS', { force: true });
    cy.contains('.toggle-label', 'Frontend')
			.parents('app-toggle')
			.find('input[type="checkbox"]')
			.click({ force: true });
    cy.get('app-file-upload input[type="file"]').selectFile('cypress/fixtures/react.jpg', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createTechnology').its('request.body').should((body) => {
      expect(body.name).to.eq('Vue.js');
      expect(body.types).to.include('FRONTEND');
      expect(body.color).to.eq('#42b883');
      expect(body.description).to.eq('<p>Framework&nbsp;JS</p>');
      expect(body.documentationUrl).to.eq('https://vuejs.org');
    });
  });

  it('should show error toast if creation fails', () => {
		cy.intercept('POST', '**/files/upload', {
			statusCode: 200,
			body: {
				success: true,
				data: { id: 123 }
			}
		}).as('uploadLogo');
    cy.intercept('POST', '**/technology/create', {
      statusCode: 500,
      body: {}
    }).as('createTechnologyFail');

    cy.get('app-button[color="success"]').click({ force: true });
    cy.get('input[name="technology-name"]').type('Erreur Tech', { force: true });
    cy.get('input[name="technology-color"]').invoke('val', '#ff0000').trigger('input');
    cy.get('input[name="technology-documentation"]').type('https://error.com', { force: true });
    cy.get('[ng-reflect-placeholder="description"] .ql-editor').type('Erreur description', { force: true });
    cy.contains('.toggle-label', 'Frontend')
			.parents('app-toggle')
			.find('input[type="checkbox"]')
			.click({ force: true });
    cy.get('app-file-upload input[type="file"]').selectFile('cypress/fixtures/react.jpg', { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });

    cy.wait('@createTechnologyFail');
    cy.get('.toast-error,.toast--error').should('exist');
  });

	it('should update a technology', () => {
		cy.intercept('POST', '**/files/upload', {
			statusCode: 200,
			body: {
				success: true,
				data: { id: 123 }
			}
		}).as('uploadLogo');
		cy.intercept('GET', '**/technology/all', {
			statusCode: 200,
			body: [
				{
					id: 10,
					name: 'Tech À Modifier',
					description: 'Old desc',
					proficiency: 50,
					documentationUrl: 'https://old.com',
					color: '#111111',
					types: ['FRONTEND'],
					isFavorite: false,
					logo: null,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				}
			]
		}).as('getTechnologiesUpdate');
		cy.intercept('PATCH', '**/technology/update/10').as('updateTechnology');
		cy.reload();
		cy.wait('@getTechnologiesUpdate');
		cy.contains('Tech À Modifier').parents('tr').within(() => {
			cy.get('.btn-update').click({ force: true });
		});
		cy.get('input[name="technology-name"]').clear({ force: true }).type('BACKEND', { force: true });
		cy.get('input[name="technology-color"]').invoke('val', '#abcdef').trigger('input');
		cy.get('input[name="technology-documentation"]').clear({ force: true }).type('https://modif.com', { force: true });
		cy.get('[ng-reflect-placeholder="description"] .ql-editor').clear({ force: true }).type('Description modifiée', { force: true });
		cy.contains('.toggle-label', 'Frontend')
			.parents('app-toggle')
			.find('input[type="checkbox"]')
			.then($checkbox => {
				if (!$checkbox.prop('checked')) {
					cy.wrap($checkbox).click({ force: true });
				}
			});
    cy.get('app-file-upload input[type="file"]').selectFile('cypress/fixtures/react.jpg', { force: true });
		cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
		cy.wait('@updateTechnology').its('request.body').should((body) => {
			expect(body.name).to.eq('BACKEND');
			expect(body.description).to.eq('<p>Description&nbsp;modifiée</p>');
			expect(body.documentationUrl).to.eq('https://modif.com');
		});
		cy.get('.toast-success,.toast--success').should('exist');
	});

  it('should delete a technology', () => {
    cy.intercept('GET', '**/technology/all', {
      statusCode: 200,
      body: [
        {
          id: 20,
          name: 'Tech À Supprimer',
          description: '',
          proficiency: 0,
          documentationUrl: '',
          color: '#222222',
          types: [],
          isFavorite: false,
          logo: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }).as('getTechnologiesDelete');

    cy.intercept('DELETE', '**/technology/delete/20').as('deleteTechnology');

    cy.reload();
    cy.wait('@getTechnologiesDelete');
    cy.contains('Tech À Supprimer').parents('tr').within(() => {
      cy.get('.btn-delete').click({ force: true });
    });
    cy.wait('@deleteTechnology');
    cy.get('.toast-success,.toast--success').should('exist');
  });
});