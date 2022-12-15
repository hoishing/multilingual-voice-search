chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'vs.htm' });
});

export {};
