// Handle side panel setup
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    chrome.action.openPopup() // Opens the popup programmatically
  }
  
  if (message.action === 'openSidePanel') {
    chrome.sidePanel.open() // Opens the side panel
  }
  
  if (message.action === 'toggleSidePanel') {
    chrome.sidePanel.getOptions({}).then((options) => {
      if (options.enabled) {
        chrome.sidePanel.close()
      } else {
        chrome.sidePanel.open()
      }
    })
  }
})

// Set up side panel when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
})
