var ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('sticky-focused', (event) => {
    $('#frame').removeClass('not-focus')
})

ipcRenderer.on('sticky-blured', (event) => {
    $('#frame').addClass('not-focus')
})