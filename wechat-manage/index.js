const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { config } = require("dotenv");
const path = require('path');
config()
let dir = process.cwd();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1060,
        height: 715,
        resizable: false,
        frame: false,
        transparent: true,
        titleBarStyle: 'hidden',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webSecurity: false,
            // devTools: false
        }
    })
    // mainWindow.webContents.on('devtools-opened', () => {
    //     mainWindow.webContents.closeDevTools();
    // });
    mainWindow.webContents.loadFile(path.join(__dirname, 'pages', 'main', 'main.html'));
    return mainWindow
}

app.disableHardwareAcceleration()

app.whenReady().then(() => {
    mainWindow = createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('close-app', (event, params) => {
    mainWindow.close()
})

ipcMain.on('open-status', (event, params) => {
    shell.openPath(path.join(dir, "weixinbot"))
})

ipcMain.on('resize-app', (event, params) => {
    mainWindow.minimize()
})

ipcMain.on('open-file-dialog', (event, params) => {
    let result = dialog.showOpenDialogSync(null, {
        filters: [
            { name: 'All Files', extensions: ['*'] }
        ]
    })
    event.sender.send("open-file-dialog-result", { result: result });
})

ipcMain.on('open-file-workspace', (event, params) => {
    shell.openPath(path.join(dir, "workspace"))
})

ipcMain.on('open-file-root', (event, params) => {
    shell.openPath(path.join(dir))
})