let tabStates = {};   // map from tabId to state
// -1 is "not applicable"
// 0 is "nascent"
// 1 is "waiting"
// 2 is "active"

function handleCreated(tab) {
    tabStates[tab.id] = -1;
}

function handleUpdated(tabId, changeInfo, tab) {
    if (changeInfo["status"] === "complete") {
        chrome.tabs.sendMessage(tabId, {
            "type": "showPageAction"
        }, function(response) {
            if (response["response"]) {
                tabStates[tab.id] = 0;
                chrome.pageAction.show(tabId);
            }
        });
    }
}

function handleRemoved(tabId, removeInfo) {
    delete tabStates[tabId];
}

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

(function() {
    chrome.tabs.onCreated.addListener(handleCreated);
    chrome.tabs.onUpdated.addListener(handleUpdated);
    chrome.tabs.onRemoved.addListener(handleRemoved);

    chrome.pageAction.onClicked.addListener(handleClicked);
})();
