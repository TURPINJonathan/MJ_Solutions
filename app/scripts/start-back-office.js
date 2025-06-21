const { spawn } = require('child_process');

const backOffice = spawn('npm', ['run', 'start'], { cwd: './back-office', stdio: 'inherit' });

backOffice.on('spawn', () => {
	const baseHref = process.env.BASE_HREF || '/akwaytenpo';
	console.log(`🟢 Back-office dev server running at http://localhost:4200${baseHref}`);
});
backOffice.on('error', (err) => {
	console.error('❌ Failed to start back-office dev server:', err);
});