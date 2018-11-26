let timeout = null;

/**
 * Saves the tick rate entered in the input text box to Chrome-sync-enabled
 * LocalStorage as an integer under the "tickRate" key.
 */
function saveOptions() {
    let rawTickRate = document.getElementById("tick-rate--input").value;
    let tickRate = parseInt(rawTickRate, 10);

    chrome.storage.sync.set({
        tickRate: tickRate
    }, function() {
        let successAlert = document.getElementById("success--alert");
        successAlert.style.display = "block";

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
            successAlert.style.display = "none";
            timeout = null;
        }, 1000);
    });
}

/**
 * Restores the tick rate saved in Chrome-sync-enabled LocalStorage to the input
 * text box.
 */
function restoreOptions() {
    chrome.storage.sync.get({
        tickRate: 10
    }, function(items) {
        let tickRate = items.tickRate;
        let rawTickRate = String(tickRate);

        document.getElementById("tick-rate--input").value = rawTickRate;
    });
}

/**
 * The entry point of the script.
 * - When the options page's DOM finishes loading, populate the tick rate input
 *   text box with the tick rate saved in LocalStorage.
 * - Attach a click handler to the Save button that saves the tick rate in the
 *   input text box to LocalStorage.
 */
(function() {
    document.addEventListener("DOMContentLoaded", restoreOptions);

    document.getElementById("save--button")
        .addEventListener("click", saveOptions);
})();
