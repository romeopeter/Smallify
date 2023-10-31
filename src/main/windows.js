const path = require("path");
const { BrowserWindow } = require("electron");

const isDev = process.env.NODE_ENV === "development";

// Main window
export function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Smallify",
    with: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preloadScript.js"),
      sandbox: false,
    },
  });

  // Open dev tools when in development mode
  if (isDev) mainWindow.webContents.openDevTools();

  // Load the remote URL for development or the local html file for production.
  if (isDev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

// About window
export function aboutWindow() {
  const win = new BrowserWindow({
    title: "Smallify | About",
    with: 300,
    height: 300,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload/preloadScript.js"),
    },
  });

  // Load the remote URL for development or the local html file for production.
  if (isDev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
