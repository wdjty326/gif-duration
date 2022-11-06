//import { app, BrowserWindow } from "electron";
//import path from "path";
const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

// 환경변수 읽기
require("dotenv").config();

function createWindow() {
  const window = new BrowserWindow({
    width: 480,
    height: 600,
  });

//  window.loadURL(
//    url.format({
//      pathname: path.join(__dirname, "..", "..", "build", "index.html"),
//      protocol: "file:",
//      slashes: true,
//    })
//  );

  window.loadFile(
    path.join(__dirname, "..", "build", "index.html")
  );
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
