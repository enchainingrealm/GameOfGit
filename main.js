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

(function() {
    chrome.runtime.onMessage.addListener(handleMessage);
})();
