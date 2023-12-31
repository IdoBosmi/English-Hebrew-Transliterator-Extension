document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ action: 'getHebrewMode' }, function (response) {
      const isHebrewMode = response.isHebrewMode || false;
      updateToggleState(isHebrewMode);
    });
  
    document.getElementById('toggleInput').addEventListener('change', function () {
      const isHebrewMode = this.checked;
      updateToggleState(isHebrewMode);
      chrome.runtime.sendMessage({ action: 'setHebrewMode', isHebrewMode });
    });
  
    function updateToggleState(isHebrewMode) {
        const input = document.getElementById('toggleInput');
        input.checked = isHebrewMode;
    }
  });
  