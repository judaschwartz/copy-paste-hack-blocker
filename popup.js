function restore_options() {
    chrome.storage.sync.get({
        enabled: ''
    }, function(items) {
        document.getElementById('enabled').checked = items.enabled
    })
    document.getElementById('enabled').addEventListener('change', (e) => {
        chrome.storage.sync.set({
            enabled :  document.getElementById('enabled').checked
        })
    })
}
document.addEventListener('DOMContentLoaded', restore_options)
