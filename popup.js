document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ action: 'getMode' }, function (response) {
      const isOn = response.isOn || false;
      updateToggleState(isOn);
    });
  
    document.getElementById('toggleInput').addEventListener('change', function () {
      const isOn = this.checked;
      updateToggleState(isOn);
      chrome.runtime.sendMessage({ action: 'setMode', isOn });
    });
  
    function updateToggleState(isOn) {
        const input = document.getElementById('toggleInput');
        input.checked = isOn;
    }
  });
  