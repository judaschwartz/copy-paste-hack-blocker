chrome.storage.sync.get({
    enabled : ''
}, function(items) {
    console.log(items)
    if (items.enabled) {
        function removeCopyListeners() {
            const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
            allElements.push(document);
            allElements.push(window);
            let elements = [];
            for (let element of allElements) {
            console.log(element)
                if (getEventListeners(element).copy) {
                    for (let listener of getEventListeners(element).copy) {
                        element.removeEventListener('copy', listener.listener)
                    }
                }
            }
            setTimeout(removeCopyListeners(), 800)
        }
        removeCopyListeners()
    }
})
