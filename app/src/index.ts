import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 환경변수 읽기
dotenv.config();

function createWindow() {
  const window = new BrowserWindow({
    width: 480,
    height: 600,
  });

  if (process.env.DEBUG === 'true')
	window.loadURL(`http://${process.env.HOST}:${process.env.PORT}`);
  else
  	window.loadFile(path.resolve(__dirname, '..', 'build', 'index.html'));	// 빌드파일위치
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
