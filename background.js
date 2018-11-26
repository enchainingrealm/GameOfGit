let tabStates = {};   // map from tabId to state
// -1 is "not applicable"
// 0 is "nascent"
// 1 is "waiting"
// 2 is "active"

/**
 * Handler fired when a tab is created.
 * The tab's ID is assigned a state of -1 in tabStates.
 * @param tab   an object representing the newly created tab
 */
function handleCreated(tab) {
    tabStates[tab.id] = -1;
}

/**
 * Handler fired when a tab is navigated to a new URL.
 * When the new page finishes loading, a message is sent to the page's content
 * script checking whether the page is a GitHub profile. If so, the tab's ID is
 * assigned a state of 0 in tabStates.
 * @param tabId   the ID of the updated tab
 * @param changeInfo   an object containing information about the update
 * @param tab   an object representing the updated tab
 */
function handleUpdated(tabId, changeInfo, tab) {
    if (changeInfo["status"] === "complete") {
        chrome.tabs.sendMessage(tabId, {
            "type": "showPageAction"
        }, function(response) {
            if (!response) {
                return;   // icon clicked on Chrome extension management tab
            }

            if (response["response"]) {
                tabStates[tab.id] = 0;
                chrome.pageAction.show(tabId);
            }
        });
    }
}

/**
 * Handler fired when a tab is closed.
 * The tab's ID is removed from tabStates to prevent memory leaks.
 * @param tabId   the ID of the closed tab
 * @param removeInfo   an object containing information about the tab close
 */
function handleRemoved(tabId, removeInfo) {
    delete tabStates[tabId];
}

/**
 * Handler fired when the Page Action icon is clicked.
 * - If the active tab's state is -1, it is not a GitHub profile, so nothing
 *   happens
 * - If the active tab's state is 0, the game gets initialized and the state is
 *   incremented to 1
 * - If the active tab's state is 1, the game starts running and the state is
 *   incremented to 2
 * - If the active tab's state is 2, the game is already running, so nothing
 *   happens
 * - If the active tab has any other (illegal) state, an Error is thrown
 * @param tab   an object containing information about the tab that was active
 * when the Page Action icon was clicked
 */
function handleClicked(tab) {
    switch (tabStates[tab.id]) {
    case -1:
        return;

    case 0:
        tabStates[tab.id] = 1;
        setWaitingIcons(tab.id, function() {
            chrome.tabs.sendMessage(tab.id, {
                "type": "initializeGame"
            });
        });
        return;

    case 1:
        tabStates[tab.id] = 2;
        setActiveIcons(tab.id, function() {
            chrome.tabs.sendMessage(tab.id, {
                "type": "runGame"
            });
        });
        return;

    case 2:
        return;

    default:
        throw new Error("Illegal tab state.");
    }
}

/**
 * The entry point of the background script.
 * Binds handlers for keeping track of tab states and message passing.
 */
(function() {
    chrome.tabs.onCreated.addListener(handleCreated);
    chrome.tabs.onUpdated.addListener(handleUpdated);
    chrome.tabs.onRemoved.addListener(handleRemoved);

    chrome.pageAction.onClicked.addListener(handleClicked);
})();
