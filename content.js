// Function to check if an element is an input field
function isInputField(element) {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }

function isGmailComposePage() {
    return window.location.href.startsWith('https://mail.google.com/mail/u/0/#inbox?compose=');
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Received message in content script:', request);

  if (request.action === 'getSelectedText') {
    // Get the currently focused element
    const focusedElement = document.activeElement;

    // Check if the focused element is an input field
    if (isInputField(focusedElement)) {
        const selectedText = focusedElement.value.substring(focusedElement.selectionStart, focusedElement.selectionEnd);
        sendResponse({ selectedText });
        return true;
    } else {

        if(isGmailComposePage()){
            const messageContentDiv = document.querySelector('.editable[aria-label="גוף ההודעה"]');
            
            if (messageContentDiv) {
                // Get the current text
                const currentText = messageContentDiv.innerText;
                console.log(currentText);
                // Get the selected text
                const selectedText = window.getSelection().toString();
                console.log(selectedText);
                sendResponse({ currentText, selectedText });
                return true;
            } else {
                console.error('Message content div not found');
            }
        }
        else{
            console.error('No active input field found');
        }
    }

} else if (request.action === 'replaceSelection') {
        const hebrewText = request.hebrewText;

        // Get the currently focused element
        const focusedElement = document.activeElement;

        // Check if the focused element is an input field
        if (isInputField(focusedElement)) {
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
            if(isGmailComposePage()){
                const hebrewText = request.hebrewText;

                const messageContentDiv = document.querySelector('.editable[aria-label="גוף ההודעה"]');
    
                if (messageContentDiv) {
                    // Get the current text
                    const currentText = messageContentDiv.innerText;
    
                    // Get the selected text
                    const selectedText = window.getSelection().toString();
    
                    // Replace the selected text within the message content div
                    const range = window.getSelection().getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(hebrewText));
    
                    // Adjust the cursor position after replacement
                    const newCursorPosition = range.startOffset + hebrewText.length;
                    const newRange = document.createRange();
                    newRange.setStart(range.startContainer, newCursorPosition);
                    newRange.setEnd(range.startContainer, newCursorPosition);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(newRange);
            
                    } else {
                        console.error('Message content div not found');
                    }
            }
            else{
                console.error('No active input field found');
            }
        }
  }
});
