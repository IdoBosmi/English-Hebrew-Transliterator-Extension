
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Received message in content script:', request);

  if (request.action === 'getSelectedText') {
      // Get the currently focused element
      const focusedElement = document.activeElement;

      // Check if the focused element is an input field
      if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
          const selectedText = focusedElement.value.substring(focusedElement.selectionStart, focusedElement.selectionEnd);
          sendResponse({ selectedText });
          return true;
      } else {
          console.error('No active input field found');
      }
  } else if (request.action === 'replaceSelection') {
      const hebrewText = request.hebrewText;

      // Get the currently focused element
      const focusedElement = document.activeElement;

      // Check if the focused element is an input field
      if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
          const selectionStart = focusedElement.selectionStart;
          const selectionEnd = focusedElement.selectionEnd;

          // Replace the selected text within the input field
          const currentText = focusedElement.value;
          const newText = currentText.substring(0, selectionStart) + hebrewText + currentText.substring(selectionEnd);
          focusedElement.value = newText;

          // Adjust the cursor position after replacement
          const newCursorPosition = selectionStart + hebrewText.length;
          focusedElement.setSelectionRange(newCursorPosition, newCursorPosition);
      } else {
          console.error('No active input field found');
      }
  }
});
