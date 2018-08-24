/**
 * Handler for message passing.
 * @param request   the incoming message sent from the background script
 * @param sender   an object containing information about the context of the
 *                 background script that sent the message
 * @param sendResponse   the response message sent back to the background script
 */
function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
    case "showPageAction":
        sendResponse({
            response: isGithubProfile()
        });
        return;

    case "initializeGame":
        initializeGame();
        sendResponse({});
        return;

    case "runGame":
        runGame();
        sendResponse({});
        return;

    default:
        throw new Error("Illegal request type.");
    }
}

/**
 * Returns true iff the current page is a GitHub profile.
 * - Uses a regular expression to check if the current URL could be a GitHub
 *   profile's URL. The regular expression may return false positives (e.g.: it
 *   matches "https://github.com/features".)
 * - Checks if the contribution activity graph is in the current page, to
 *   mitigate false positives.
 * @returns {!boolean}   whether the current page is a GitHub profile
 */
function isGithubProfile() {
    let re = /^https?:\/\/(www\.)?github.com\/\w+\/?$/;
    if (!re.test(location.href)) {
        return false;
    }

    let elements = document.getElementsByClassName("js-calendar-graph");
    if (elements.length !== 1) {
        return false;
    }

    return true;
}

/**
 * The entry point of the content script.
 * Binds handler for message passing.
 */
(function() {
    chrome.runtime.onMessage.addListener(handleMessage);
})();
