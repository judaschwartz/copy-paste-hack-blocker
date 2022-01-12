chrome.storage.sync.get({
    enabled : ''
}, function(items) {
    document.addEventListener('copy', (e) => {
        setTimeout(checkCopy, 10, document.getSelection().toString())
    }, true)
    document.addEventListener('cut', (e) => {
        setTimeout(checkCopy, 10, document.getSelection().toString())
    }, true)
    function checkCopy (selection) {
        const input = document.createElement("textarea")
        input.style.position = "fixed"
        document.body.appendChild(input)
        input.focus()
        document.execCommand("paste")
        const clip = input.value
        document.body.removeChild(input)
        const message = `
The text copied to your clipboard does not match the selected text.
The text selected on this page starts with: 

${selection.slice(0, 400)}

The text copied to your clipboard starts with:

${clip.slice(0, 400)}

Do you want to put the selected text in your clipboard instead?`
        if (clip && selection !== clip) {
            const i = document.createElement('textarea')
            i.innerHTML = selection
            selection = i.value.replace(/\u00a0/g, ' ')
            if (selection !== clip && (items.enabled || confirm(message))) {
                document.body.appendChild(i)
                i.select()
                document.execCommand('copy')
                document.body.removeChild(i)
            }
        }
    }
})
