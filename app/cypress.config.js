const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    specPattern: '**/e2e/**/*.cy.js'
  }
});