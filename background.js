// background.js
let isOn = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getMode') {
    sendResponse({ isOn });
  } else if (request.action === 'setMode') {
    isOn = request.isOn;
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'convertSelection') {
        if (isOn) {
            convertSelection();
        }
  }
});

function convertSelection() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, function (response) {
          if (response && response.selectedText) {
            const selectedText = response.selectedText;
            const convertedText = transliterateText(selectedText);
            chrome.tabs.sendMessage(tabs[0].id, { action: 'replaceSelection', convertedText });
          } else {
            console.error('Error: Invalid or missing response from content script');
          }
        });
      });
      
}

function transliterateText(englishText) {
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
        ש: 'a',
        נ: 'b',
        ב: 'c',
        ג: 'd',
        ק: 'e',
        כ: 'f',
        ע: 'g',
        י: 'h',
        ן: 'i',
        ח: 'j',
        ל: 'k',
        ך: 'l',
        צ: 'm',
        מ: 'n',
        ם: 'o',
        פ: 'p',
        '/': 'q',
        ר: 'r',
        ד: 's',
        א: 't',
        ו: 'u',
        ה: 'v',
        '\'': 'w',
        ס: 'x',
        ט: 'y',
        ז: 'z'
      };
    
      return englishText.split('').map(char => mapping[char] || char).join('');
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url === "chrome://new-tab-page/") {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
  }
});   