const os = require("os");
const { join } = require("path");
const { ipcRenderer, contextBridge } = require("electron");
const Toastify = require("toastify-js");

// Expose native Node API modules to renderer process
contextBridge.exposeInMainWorld("nodeAPI", {
  homedir: () => os.homedir(),
  join: (...args) => join(...args),
});

// Expose Toastify module to renderer
contextBridge.exposeInMainWorld("Toastify", {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(args)),
});
