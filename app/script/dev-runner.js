const cp = require('child_process');
const path = require('path');

function pipeline (command, args, options) {
	const pipe = cp.spawn(`${command}.cmd`, args, options);
	pipe.stdout.on('data', (buffer) => {
		console.info(`stdout: ${buffer.toString('utf-8')}`);
	});
	pipe.stderr.on('data', (buffer) => {
		console.error(`stderr: ${buffer.toString('utf-8')}`);
	});

	return pipe;
}

// 서버 실행
pipeline('yarn', ['start'], {
	cwd: path.resolve(__dirname, '..', '..'),
	stdio: 'pipe',
});

// tsc watch
pipeline('tsc', ['--watch'], {
	cwd: path.resolve(__dirname, '..'),
	stdio: 'pipe',
});

// 클라이언트 실행
pipeline('electron', ['.'], {
	cwd: path.resolve(__dirname, '..'),
	stdio: 'pipe',
});
