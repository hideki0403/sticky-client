const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu
const ipc = electron.ipcMain
const windowStateKeeper = require('electron-window-state')

var mainWindow = null

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

if (!app.requestSingleInstanceLock()) {
  app.exit()
} else {
  app.on('second-instance', (e, c, w) => {
    mainWindow.show()
  })

  app.on('ready', function() {

    const state = windowStateKeeper({
      defaultWidth: 275,
      defaultHeight: 275
    })

    mainWindow = new BrowserWindow({
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
      frame: false,
      alwaysOnTop: true,
      icon: __dirname + '/src/sticky.png'
    })

    mainWindow.loadURL('file://' + __dirname + '/src/index.html')

    if(!app.isPackaged) {
      console.log('[Debug] EnableDevTools')
      mainWindow.openDevTools()
    }

    const trayIcon = new Tray(__dirname + '/src/sticky.png')
    var contextMenu = Menu.buildFromTemplate([
      { label: 'ウィンドウを表示', click: function() {mainWindow.show()} },
      { type: 'separator' },
      { label: '再起動', click: function() {app.relaunch(); app.exit()} },
      { label: '終了', click: function() {app.exit()} }
    ])
    trayIcon.setContextMenu(contextMenu)
    trayIcon.setToolTip('StickyClient v' + app.getVersion())

    trayIcon.on('click', function () {
      if(mainWindow.isVisible()) {
        mainWindow.close()
      } else {
        mainWindow.show()
      }
    })

    mainWindow.on('close', (event) => {
      event.preventDefault()
      mainWindow.hide()
    })

    mainWindow.on('focus', (event) => {
        mainWindow.webContents.send('sticky-focused')
    })

    mainWindow.on('blur', (event) => {
        mainWindow.webContents.send('sticky-blured')
    })

    state.manage(mainWindow)

  })
}