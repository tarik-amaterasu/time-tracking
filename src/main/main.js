import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeImage,
  screen,
} from "electron";
import express from "express";
import * as path from "path";
import extractBasics from "./middlewares";
import router from "./routes";
import Logo from "../app-assets/logo-rounded.png";

/**
 * mainWindow {BrowserWindow}
 */
let mainWindow;
const smallVersion = {
  height: 128,
  width: 530,
};
const expandedVersion = {
  width: 530,
  height: 500,
};
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { width: w, height: h } = smallVersion;
  mainWindow = new BrowserWindow({
    width: w,
    height: h,
    title: "Shiftify - Time Tracker",
    x: width - w,
    y: height - h + 25,
    transparent: false,
    roundedCorners: true,
    resizable: true,
    icon: path.join(__dirname, "../../app-assets/logo-main.png"),
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      webSecurity: false,
      nodeIntegration: true,
    },
  });
  // Vite DEV server URL
  // mainWindow.setBadgeCount
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => (mainWindow = null));
}
function resizeWindow(expand = false) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const [x, y] = mainWindow.getPosition();
  const [_w, _h] = mainWindow.getSize();
  const { width: w, height: h } = expand ? expandedVersion : smallVersion;
  if (_w === w && _h === h) {
    return;
  }
  mainWindow.setSize(w, h);
  if (x + w > width || y + h > height) {
    mainWindow.setPosition(width - w, height - h + 25);
  }
  if (!expand) {
    mainWindow.setPosition(width - w, height - h + 25);
  }
}

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, "./app-assets/logo-main-bg.png");
  // console.log(iconPath, Logo);
  const dockIcon = nativeImage.createFromDataURL(Logo);
  app.dock.setIcon(dockIcon);
  ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});
const application = express();
const onPort = 8080;
application.use(express.json());
application.use(extractBasics);
application.use((req, res, next) => {
  req.electronApp = app;
  req.mainWindow = mainWindow;
  req.resizeWindow = resizeWindow;
  return next();
});
application.use("/api", router);
application.get("/", (req, res) => {
  app.setBadgeCount(20);
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow.setPosition(width - 500 - 20, height - 500 - 20);
  mainWindow.setSize(500, 500);
  return res.send("Hello World");
});
application.listen(onPort, () => {
  console.log("Listening", onPort);
});
