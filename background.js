// background.js
let isHebrewMode = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getHebrewMode') {
    sendResponse({ isHebrewMode });
  } else if (request.action === 'setHebrewMode') {
    isHebrewMode = request.isHebrewMode;
  } else if (request.action === 'convertSelection') {
    convertSelectionToHebrew();
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'convertSelection') {
        if (isHebrewMode) {
            convertSelectionToHebrew();
        }
  }
});

function convertSelectionToHebrew() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, function (response) {
          if (response && response.selectedText) {
            const selectedText = response.selectedText;
            const hebrewText = convertToHebrew(selectedText);
            chrome.tabs.sendMessage(tabs[0].id, { action: 'replaceSelection', hebrewText });
          } else {
            console.error('Error: Invalid or missing response from content script');
          }
        });
      });
      
}

function convertToHebrew(englishText) {
    const mapping = {
        a: 'ש',
        b: 'נ',
        c: 'ב',
        d: 'ג',
        e: 'ק',
        f: 'כ',
        g: 'ע',
        h: 'י',
        i: 'ן',
        j: 'ח',
        k: 'ל',
        l: 'ך',
        m: 'צ',
        n: 'מ',
        o: 'ם',
        p: 'פ',
        q: '/',
        r: 'ר',
        s: 'ד',
        t: 'א',
        u: 'ו',
        v: 'ה',
        w: '\'',
        x: 'ס',
        y: 'ט',
        z: 'ז',
        A: 'ש',
        B: 'נ',
        C: 'ב',
        D: 'ג',
        E: 'ק',
        F: 'כ',
        G: 'ע',
        H: 'י',
        I: 'ן',
        J: 'ח',
        K: 'ל',
        L: 'ך',
        M: 'צ',
        N: 'מ',
        O: 'ם',
        P: 'פ',
        Q: '/',
        R: 'ר',
        S: 'ד',
        T: 'א',
        U: 'ו',
        V: 'ה',
        W: '\'',
        X: 'ס',
        Y: 'ט',
        Z: 'ז',
      };
    
      return englishText.split('').map(char => mapping[char] || char).join('');
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url === "chrome://new-tab-page/") {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
  }
});   