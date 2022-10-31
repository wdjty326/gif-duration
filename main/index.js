const { app, BrowserWindow } = require('electron');


let window;

app.on('ready', () => {
	window = new BrowserWindow({
		width: 480,
		height: 600,
	});

	window.loadFile('index.html');
});
