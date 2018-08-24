/**
 * Sets the icon of the Page Action button on the tab with the given ID to the
 * "waiting" icon, then calls the callback.
 * @param tabId   the ID of the tab to set the Page Action button icon on
 * @param callback   a nullary function called after the icon is set
 */
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

/**
 * Sets the icon of the Page Action button on the tab with the given ID to the
 * "active" icon, then calls the callback.
 * @param tabId   the ID of the tab to set the Page Action button icon on
 * @param callback   a nullary function called after the icon is set
 */
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
