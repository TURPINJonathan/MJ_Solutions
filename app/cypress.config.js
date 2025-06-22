const { defineConfig } = require('cypress');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    specPattern: '**/e2e/**/*.cy.js',
		supportFile: path.resolve(__dirname, 'cypress/support/e2e.js')
  }
});