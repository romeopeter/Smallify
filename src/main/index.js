const path = require("path");
const os = require("os");
const { readFileSync, existsSync, mkdirSync, writeFileSync } = require("fs");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const ResizeImg = require("resize-img");

import { createMainWindow } from "./windows";
import { menuTemplate } from "./menu";

const isMac = process.platform === "darwin";

// Resize image
async function resizeImage(
  window = undefined,
  { width, height, imgPath, dest },
) {
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
    writeFileSync(path.join(dest, filename), newPath);

    // Send success message
    if (window) window.webContents.send("image:done");

    // Open folder to newly resize image
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
}

// App launches and is ready
app.whenReady().then(() => {
  let mainWindow = createMainWindow();

  // App menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Response to IPC renderer message on channel "image:resize"
  ipcMain.on("image:resize", (_event, data) => {
    data.dest = path.join(os.homedir(), "smallify");
    resizeImage(mainWindow, data);
  });

  // Remove main window from memory when closed
  mainWindow.on("close", () => (mainWindow = null));

  // Open window if none is open (MacOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow;
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
