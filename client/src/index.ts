//import electron from "electron";
const { app, BrowserWindow } = require('electron');

let window;

app.on("ready", () => {
  window = new BrowserWindow({
    width: 480,
    height: 600,
  });

  window.loadURL(
    process.env.DEBUG === "true"
      ? "http://localhost:3000"
      : "https://wdjty326.github.io/gif-duration"
  );
});
