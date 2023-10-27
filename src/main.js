const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV === "development";

const menuTemplate = [
  { role: "appMenu" },
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about", click: () => aboutWindow() },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  { role: "fileMenu" },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [{ label: "About", click: () => aboutWindow() }],
        },
      ]
    : []),
];

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

  win.loadURL("http://localhost:5173/");
}

// About window
function aboutWindow() {
  const win = new BrowserWindow({
    title: "Smallify | About",
    with: 300,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "../preload/script.js"),
    },
  });

  win.loadURL("http://localhost:5173/");
}

// App launches and is ready
app.whenReady().then(() => {
  mainWindow();

  // App menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Open window if none is open (MacOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
