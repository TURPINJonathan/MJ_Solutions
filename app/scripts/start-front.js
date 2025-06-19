const { spawn } = require('child_process');

const front = spawn('npm', ['run', 'dev'], { cwd: './front', stdio: 'inherit' });

front.on('spawn', () => {
  console.log('🟢 Front dev server running at http://localhost:3000');
});
front.on('error', (err) => {
	console.error('❌ Failed to start front dev server:', err);
});