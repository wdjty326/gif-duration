const cp = require('child_process');
const path = require('path');

function pipeline (command, args, options) {
	return new Promise((resovle, reject) => {
		const pipe = cp.spawn(`${command}.cmd`, args, options);
		pipe.stdout.on('data', (buffer) => {
			console.info(`stdout: ${buffer.toString('utf-8')}`);
		});
		pipe.stderr.on('data', (buffer) => {
			console.error(`stderr: ${buffer.toString('utf-8')}`);
		});

		pipe.once('exit', () => resovle());
		pipe.once('error', () => reject());

		return pipe;
	});
}

// 서버 실행
pipeline('yarn', ['build'], {
	cwd: path.resolve(__dirname, '..', '..'),
	stdio: 'pipe',
	env: {
		PUBLIC_URL: "./",
		ELECTRON_BUILD: path.resolve(__dirname, '..', 'build'),
	},
}).then(() => {
	return pipeline('tsc', ['-p', '.'], {
		cwd: path.resolve(__dirname, '..'),
		stdio: 'pipe',	
	})
}).then(() => {
	// 클라이언트 실행
	return pipeline('electron-builder', ['--win'], {
		cwd: path.resolve(__dirname, '..'),
		stdio: 'pipe',
	})
});
