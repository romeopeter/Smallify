import { app } from "electron";
import { aboutWindow } from "./windows";

const isMac = process.platform === "darwin";

export const menuTemplate = [
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
