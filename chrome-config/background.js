chrome.app.runtime.onLaunched.addListener(function () {
  chrome.app.window.create('index.html', {
    'innerBounds': {
      'width': 1200,
      'height': 700,
      'minWidth': 1200,
      'minHeight': 700
    },
    'id': 'ChromeApps-Sample-USB-DeviceInfo'
  })
});
