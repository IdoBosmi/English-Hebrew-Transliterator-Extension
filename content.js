// Function to check if an element is an input field
function isInputField(element) {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }

function isGoogleDocsPage() {
    return window.location.href.startsWith('https://docs.google.com/document/d/') && window.location.href.endsWith('/edit');
}
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'getSelectedText') {
        let selectedText = '';

        if (isGoogleDocsPage()) {
            try {
                // Simulate copy action within the Google Docs iframe
                document.querySelector(".docs-texteventtarget-iframe").contentDocument.execCommand("copy");
                
                // Retrieve selected text from the iframe's body
                selectedText = document.querySelector(".docs-texteventtarget-iframe").contentDocument.body.innerText;
                
                // Now 'selectedText' contains the text from the Google Docs iframe
                console.log('Selected text in Google Docs:', selectedText);
            } catch (error) {
                console.error('Error with clipboard workaround:', error);
            }
        } else {
            const sel = window.getSelection();
            if (sel && sel.toString()) {
                selectedText = sel.toString();
            }
        }

        sendResponse({ selectedText });
    } else if (request.action === 'replaceSelection') {
        const convertedText = request.convertedText;

        if (isGoogleDocsPage()) {
            try {
                // Copy the Hebrew text to the clipboard
                await navigator.clipboard.writeText(convertedText);

                // Replace the selected text by pasting the new text
                document.querySelector(".docs-texteventtarget-iframe").contentDocument.execCommand("paste");
                
                // Remove the copied text from the clipboard
                document.querySelector(".docs-texteventtarget-iframe").contentDocument.execCommand("delete");
            } catch (error) {
                console.error('Error with clipboard workaround:', error);
            }
        } else {
            const focusedElement = document.activeElement;
            
            if (isInputField(focusedElement)) {
                const selectionStart = focusedElement.selectionStart;
                const selectionEnd = focusedElement.selectionEnd;

                // Replace the selected text within the input field
                const currentText = focusedElement.value;
                const newText = currentText.substring(0, selectionStart) + convertedText + currentText.substring(selectionEnd);
                focusedElement.value = newText;

                // Adjust the cursor position after replacement
                const newCursorPosition = selectionStart + convertedText.length;
                focusedElement.setSelectionRange(newCursorPosition, newCursorPosition);
            } else {
                const sel = window.getSelection();
                if (sel.rangeCount) {
                    const range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(convertedText));
                }
            }
        }
    }
});
