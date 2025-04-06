const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        resizable: true,
        show: false // Don't show until ready
    });

    // Load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'))
        .catch(err => {
            console.error('Failed to load index.html:', err);
        });

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Register IPC handlers
    ipcMain.on('minimize-window', () => {
        mainWindow.minimize();
    });

    // Handle window errors
    mainWindow.webContents.on('crashed', () => {
        console.error('Window crashed');
    });

    mainWindow.on('unresponsive', () => {
        console.error('Window became unresponsive');
    });
};

// This method will be called when Electron has finished initialization
app.whenReady()
    .then(createWindow)
    .catch(err => {
        console.error('Failed to initialize app:', err);
        app.quit();
    });

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});