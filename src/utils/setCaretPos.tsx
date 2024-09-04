
export const setCaretPos = (element: HTMLParagraphElement) => {
    const target = document.createTextNode("");
    element.appendChild(target);

    const isTargetFocused = document.activeElement === element;

    if (target !== null && target.nodeValue !== null && isTargetFocused) {
        let sel = window.getSelection();
        if (sel !== null) {
            let range = document.createRange();
            range.setStart(target, target.nodeValue.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        if (element instanceof HTMLElement) element.focus(); //event if this sub element focus
    }
};