chrome.storage.sync.get({
    enabled : ''
}, function(items) {
    let timer = 0

    document.addEventListener('copy', (e) => {
        let sel = window.getSelection()
        timer = setTimeout(checkCopy, 10, sel.toString(), getRange(sel), false)
    }, true)

    document.addEventListener('cut', (e) => {
        let sel = window.getSelection()
        timer = setTimeout(checkCopy, 10, sel.toString(), getRange(sel), true)
    }, true)

    document.addEventListener('copy', (event) => {
        clearTimeout(timer)
        let clip = event.clipboardData.getData('text/plain')
        const selection = document.getSelection().toString()
        if (clip && selection.toLowerCase().replace(/[^a-z0-9]/g, '') !== clip.toLowerCase().replace(/[^a-z0-9]/g, '')
        && (items.enabled || confirm(getMessage(clip, selection)))) {
            event.clipboardData.setData('text/plain', selection)
        }
    })

    document.addEventListener('cut', (event) => {
        clearTimeout(timer)
        let clip = event.clipboardData.getData('text/plain')
        const selection = document.getSelection().toString()
        if (clip && selection.toLowerCase().replace(/[^a-z0-9]/g, '') !== clip.toLowerCase().replace(/[^a-z0-9]/g, '')
            && (items.enabled || confirm(getMessage(clip, selection)))) {
            event.clipboardData.setData('text/plain', selection)
        }
    })

    function getMessage(clip, selection) { return `
The text copied to your clipboard does not match the selected text.
The text selected on this page starts with: 

${selection.slice(0, 400)}

The text copied to your clipboard starts with:

${clip.slice(0, 400)}

Do you want to put the selected text in your clipboard instead?`
    }

    function checkCopy (selection, range, cut) {
        console.log('hit')
        if (cut && window.getSelection().toString()) {return}
        const input = document.createElement("textarea")
        input.style.position = "fixed"
        document.body.appendChild(input)
        input.focus()
        document.execCommand("paste")
        const clip = input.value
        document.body.removeChild(input)
        if (clip && selection !== clip) {
            const i = document.createElement('textarea')
            i.innerHTML = selection
            if (i.value.toLowerCase().replace(/[^a-z0-9]/g, '') !== clip.toLowerCase().replace(/[^a-z0-9]/g, '') && (items.enabled || confirm(getMessage(clip, selection)))) {
                document.body.appendChild(i)
                i.select()
                document.execCommand('copy')
                document.body.removeChild(i)
            }
        }
        reselect(range)
    }

    function getRange(sel) {
        let range = sel.getRangeAt(0)
        let startNode = range.startContainer
        let endNode = range.endContainer
        if (startNode.nodeType == 3) {
            var startIsText = true
            var startFlag = startNode.parentNode
            startNode = startNode.nodeValue
        } else {
            var startIsText = false
            var startFlag = startNode
        }
        if (endNode.nodeType == 3) {
            var endIsText = true
            var endFlag = endNode.parentNode
            endNode = endNode.nodeValue
        } else {
            var endIsText = false
            var endFlag = endNode
        }
        let startOffset = range.startOffset
        let endOffset = range.endOffset
        let startTagName = startFlag.nodeName
        let startHTML = startFlag.innerHTML
        let endTagName = endFlag.nodeName
        let endHTML = endFlag.innerHTML
        return {
            startNode: startNode,
            startOffset: startOffset,
            startIsText: startIsText,
            startTagName: startTagName,
            startHTML: startHTML,
            endNode: endNode,
            endOffset: endOffset,
            endIsText: endIsText,
            endTagName: endTagName,
            endHTML: endHTML
        }
    }

    function findEle(tagName, innerHTML) {
        let list = document.getElementsByTagName(tagName)
        for (let i = 0; i < list.length; i++) {
            if (list[i].innerHTML == innerHTML) {
                return list[i]
            }
        }
    }

    function select(startNode,startIsText,startOffset,endNode,endIsText,endOffset,sP,eP) {
        var s, e
        if (startIsText) {
            let child = sP.childNodes
            for (let i = 0; i < child.length; i++) {
                if (child[i].nodeType == 3 && child[i].nodeValue == startNode) {
                    s = child[i]
                }
            }
        } else {
            s = startNode
        }
        if (endIsText) {
            let child = eP.childNodes
            for (let i = 0; i < child.length; i++) {
                if (child[i].nodeType == 3 && child[i].nodeValue == endNode) {
                    e = child[i]
                }
            }
        } else {
            e = endNode
        }
        let range = document.createRange()
        range.setStart(s, startOffset)
        range.setEnd(e, endOffset)
        let sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
    }

    function reselect(range) {
        select(
            range.startNode,
            range.startIsText,
            range.startOffset,
            range.endNode,
            range.endIsText,
            range.endOffset,
            findEle(range.startTagName, range.startHTML),
            findEle(range.endTagName, range.endHTML)
        )
    }
})
