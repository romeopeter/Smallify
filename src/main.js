const path = require("path");
const os = require("os");
const { readFileSync, existsSync, mkdirSync, writeFileSync } = require("fs");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const ResizeImg = require("resize-img");

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

// Exposed main window in the global scope
let mainWindow

// Main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
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
}

// About window
function aboutWindow() {
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

// App launches and is ready
app.whenReady().then(() => {
  createMainWindow();

  // App menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Response to IPC renderer message on channel "image:resize"
  ipcMain.on("image:resize", (_event, data) => {
    data.dest = path.join(os.homedir(), "smallify");
    resizeImage(data);
  });

  // Remove main window from memory when closed
  mainWindow.on("close", () => mainWindow = null);

  // Open window if none is open (MacOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow();
  });
});

// Resize image
async function resizeImage({ width, height, imgPath, dest }) {
  try {
    const newPath = await ResizeImg(readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    // File name
    const filename = path.basename(imgPath);

    // Create file destination if not available
    if (!existsSync(dest)) mkdirSync(dest);

    // Write new file to destination
    writeFileSync(path.join(dest, filename), newPath)

    // Send success message
    mainWindow.webContents.send("image:done")

    // Open folder to newly resize image
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
}

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
