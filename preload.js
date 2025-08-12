const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  
  // App-specific APIs
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Platform detection
  isElectron: true,
  isMobile: false,
  isDesktop: true,
  
  // App info
  appName: 'Glow24 Organics',
  appVersion: '1.0.0'
});

// Expose a limited API for the app
contextBridge.exposeInMainWorld('glow24App', {
  platform: 'desktop',
  version: '1.0.0',
  isElectron: true,
  
  // Contact methods
  contact: {
    phone: '+919363717744',
    email: 'glow24@gmail.com',
    whatsapp: 'https://wa.me/919363717744'
  },
  
  // App capabilities
  capabilities: {
    notifications: true,
    fileSystem: true,
    camera: false,
    geolocation: false,
    offline: true
  }
});
