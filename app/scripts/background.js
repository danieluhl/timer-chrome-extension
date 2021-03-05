browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

browser.browserAction.setBadgeText({
  text: `5:00`
})
