// Function to check if an element is an input field
function isInputField(element) {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }

function isGmailComposePage() {
    return window.location.href.startsWith('https://mail.google.com/mail/u/0/#inbox?compose=');
}

function isGoogleDocsPage() {
    return window.location.href.startsWith('https://docs.google.com/document/d/') && window.location.href.endsWith('/edit');
}

chrome.runtime.onMessage.addListener( async function (request, sender, sendResponse) {
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
                sendResponse({selectedText });
                return true;
            } else {
                console.error('Message content div not found');
            }
        } else if (isGoogleDocsPage()) {

            try {
                // Simulate copy action within the Google Docs iframe
                document.querySelector(".docs-texteventtarget-iframe").contentDocument.execCommand("copy");
                
                // Retrieve selected text from the iframe's body
                const selectedText = document.querySelector(".docs-texteventtarget-iframe").contentDocument.body.innerText;
                
                // Now 'selectedText' contains the text from the Google Docs iframe
                console.log('Selected text in Google Docs:', selectedText);

                sendResponse({ selectedText });
                return true;
                
                // Perform your logic with the selected text as needed
              } catch (error) {
                console.error('Error with clipboard workaround:', error);
              }
        } else{
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
            } else if (isGoogleDocsPage()) {
                try {
                    const hebrewText = request.hebrewText;
                    // Copy the Hebrew text to the clipboard
                    await navigator.clipboard.writeText(hebrewText);

                    // Replace the selected text by pasting the new text
                    document.querySelector(".docs-texteventtarget-iframe").contentDocument.execCommand("paste");
                    
                    // Remove the copied text from the clipboard
                    document.querySelector(".docs-texteventtarget-iframe").contentDocument.execCommand("delete");
                  } catch (error) {
                    console.error('Error with clipboard workaround:', error);
                  }
            } else{
                console.error('No active input field found');
            }
        }
  }
});

