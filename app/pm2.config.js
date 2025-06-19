module.exports = {
  apps: [
    // 🔁 DEV SERVERS
    {
      name: 'front',
      cwd: './', // scripts est à la racine de app
      script: './scripts/start-front.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'back-office',
      cwd: './',
      script: './scripts/start-back-office.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development'
      }
    },

    // 🛠 BUILDS INDIVIDUELS
    {
      name: 'front-build',
      script: 'npm',
      args: 'run build',
      cwd: './front',
      env: { NODE_ENV: 'production' },
      autorestart: false
    },
    {
      name: 'back-office-build',
      script: 'npm',
      args: 'run build',
      cwd: './back-office',
      env: { NODE_ENV: 'production' },
      autorestart: false
    },

    // 🧪 TESTS INDIVIDUELS
    {
      name: 'front-test',
      script: 'npm',
      args: 'run test',
      cwd: './front',
      env: { NODE_ENV: 'test' },
      autorestart: false
    },
    {
      name: 'back-office-test',
      script: 'npm',
      args: 'run test',
      cwd: './back-office',
      env: { NODE_ENV: 'test' },
      autorestart: false
    },

    // 📦 BUILD GLOBAL
    {
      name: 'all-build',
      script: 'bash',
      args: '-c "npm run build --prefix front && npm run build --prefix back-office"',
      cwd: '.',
      autorestart: false
    },

    // 🧪 TEST GLOBAL
    {
      name: 'all-test',
      script: 'bash',
      args: '-c "npm run test --prefix front && npm run test --prefix back-office"',
      cwd: '.',
      autorestart: false
    }
  ]
};