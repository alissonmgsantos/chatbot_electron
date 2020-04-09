const { app, BrowserWindow, screen, ipcMain, Tray, Menu } = require('electron');

let browserWindow = null;

app.on('ready', () => {
  console.log('Application started');
  let display = screen.getPrimaryDisplay();

  browserWindow = new BrowserWindow({
    width: 400,
    height: display.bounds.width - display.bounds.height,
    x: display.bounds.width - 402,
    y: 126,
    frame: false,
    webPreferences: { nodeIntegration: true },
  });

  let tray = new Tray(`${__dirname}/src/app/assets/img/avatar.png`);
  tray.setToolTip('Electron Assistent');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Abrir',
        click: () => {
          browserWindow.show();
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Fechar',
        click: () => {
          browserWindow.destroy();
          app.quit();
        },
      },
    ])
  );
  tray.on('double-click', () => {
    browserWindow.show();
  });

  browserWindow.loadFile(`${__dirname}/src/app/intro.html`);
});

ipcMain.on('openChat', () => {
  browserWindow.loadFile(`${__dirname}/src/app/index.html`);
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('minimizeChat', () => {
  browserWindow.hide();
});

ipcMain.on('closeChat', () => {
  browserWindow.close();
});
