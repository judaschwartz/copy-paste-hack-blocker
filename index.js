chrome.storage.sync.get({
    enabled : ''
}, function(items) {
    document.addEventListener('copy', (event) => {
        let clip = event.clipboardData.getData('text/plain')
        const selection = document.getSelection().toString()
        const message = `
The text that was copied clipboard does not match selected text.
The selected starts with: 

${selection.slice(0, 400)}

The text was copied to your clipboard starts with:

${clip.slice(0, 400)}

Do you want to put the selected text in your clipboard instead?`
        if (clip && selection !== clip && (items.enabled || confirm(message))) {
            event.clipboardData.setData('text/plain', selection.toString())
        }
    })
})
