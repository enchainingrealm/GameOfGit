function setWaitingIcons(tabId, callback) {
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            "16": "images/waiting/logo16.png",
            "32": "images/waiting/GitHub-Mark-32px.png",
            "48": "images/waiting/logo48.png",
            "128": "images/waiting/logo128.png"
        }
    }, callback);
}

function setActiveIcons(tabId, callback) {
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            "16": "images/active/logo16.png",
            "32": "images/active/logo32.png",
            "48": "images/active/logo48.png",
            "128": "images/active/logo128.png"
        }
    }, callback);
}
