const { spawn } = require('child_process');

const backOffice = spawn('npm', ['run', 'start'], { cwd: './back-office', stdio: 'inherit' });

backOffice.on('spawn', () => {
  console.log('🟢 Back-office dev server running at http://localhost:4200/akwaytenpo');
});
backOffice.on('error', (err) => {
	console.error('❌ Failed to start back-office dev server:', err);
});