/**
 * If there is exactly one DOM element with the given class name, returns the
 * DOM element. Otherwise, throws an Error.
 * @param className   the class name to find and return an element of
 * @returns {!Element}   the DOM element with the given class name
 */
function getElementByClassName(className) {
    let elements = document.getElementsByClassName(className);

    if (elements.length !== 1) {
        throw new Error("Illegal elements.length");
    }

    return elements[0];
}

/**
 * If the given DOM element has exactly one child, returns the child. Otherwise,
 * throws an Error.
 * @param element   the DOM element to return the child of
 * @returns {!Element}   the child element of the given DOM element
 */
function getChild(element) {
    let children = element.children;

    if (children.length !== 1) {
        throw new Error("Illegal children.length");
    }

    return children[0];
}

/**
 * Removes the given DOM element from its parent.
 * @param element   the DOM element to remove from its parent
 */
function removeElement(element) {
    element.parentElement.removeChild(element);
}
