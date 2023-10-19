const path = require("path");
const { app, BrowserWindow } = require("electron");

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV === "development";

function createMainWindow() {
  const win = new BrowserWindow({ title: "Smallify", with: 800, height: 600 });

  // Open dev tools if in development mode
  if (isDev) win.webContents.openDevTools();

  win.loadFile(path.join(__dirname, "renderer/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  // Open window if none is open (MacOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
