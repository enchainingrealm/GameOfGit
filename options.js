let timeout = null;

/**
 * Saves the tick rate entered in the input text box to Chrome-sync-enabled
 * LocalStorage as an integer under the "tickRate" key. Does not save if the
 * contents of the text box are invalid (not a positive integer.)
 */
function saveOptions() {
    let input = document.getElementById("tick-rate--input");
    if (!input.checkValidity()) {
        return;
    }

    let rawTickRate = input.value;
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
 * Returns true iff the contents of the tick rate input text box are a positive
 * integer.
 */
function validateTickRate() {
    let input = document.getElementById("tick-rate--input");
    let rawTickRate = input.value;

    if (/^\d+$/.test(rawTickRate) && parseInt(rawTickRate) > 0) {
        input.setCustomValidity("");
    } else {
        input.setCustomValidity("Enter a positive integer.")
    }
}

/**
 * The entry point of the script.
 * - When the options page's DOM finishes loading, populate the tick rate input
 *   text box with the tick rate saved in LocalStorage.
 * - Attach an event listener to the tick rate input text box that updates the
 *   text box's validity whenever its text is changed.
 * - Attach a click handler to the Save button that saves the tick rate in the
 *   input text box to LocalStorage.
 */
(function() {
    document.addEventListener("DOMContentLoaded", restoreOptions);

    document.getElementById("tick-rate--input")
        .addEventListener("change", validateTickRate);

    document.getElementById("save--button")
        .addEventListener("click", saveOptions);
})();
