function getElementByClassName(className) {
    let elements = document.getElementsByClassName(className);

    if (elements.length !== 1) {
        throw new Error("Illegal elements.length");
    }

    return elements[0];
}

function getChild(element) {
    let children = element.children;

    if (children.length !== 1) {
        throw new Error("Illegal children.length");
    }

    return children[0];
}

function removeElement(element) {
    element.parentElement.removeChild(element);
}
