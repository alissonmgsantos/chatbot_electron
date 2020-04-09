require('dotenv').config({ silent: true });
const { ipcRenderer } = require('electron');

// Version
let version = document.querySelector('#version');
if (version) {
  window.onload = () => (version.textContent = process.env.version);
}

// Starting conversation
let openChat = document.querySelector('#openChat');
openChat &&
  openChat.addEventListener('click', () => ipcRenderer.send('openChat'));

// Minimize
let minimizeChat = document.querySelector('#minimizeChat');
minimizeChat &&
  minimizeChat.addEventListener('click', () =>
    ipcRenderer.send('minimizeChat')
  );

// Close
let closeChat = document.querySelector('#closeChat');
closeChat &&
  closeChat.addEventListener('click', () => ipcRenderer.send('closeChat'));
