const path = require("path");
const { app, BrowserWindow} = require("electron");

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV === "development";

// Main window
function mainWindow() {
  const win = new BrowserWindow({
    title: "Smallify",
    with: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/script.js"),
    },
  });

  // Open dev tools if in development mode
  if (isDev) win.webContents.openDevTools();

  win.loadURL("http://localhost:5173/")
}

// App launches and is ready
app.whenReady().then(() => {
  mainWindow();


  // Open window if none is open (MacOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
