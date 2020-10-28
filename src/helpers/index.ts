const BARCODES = {
    EAN: 'ean_13',
    EAN_8: 'ean_8',
    CODE_39: 'code_39',
}

export const TYPES_BARCODES  = {
    [BARCODES.EAN]: (str: String) => `${str.substr(0, 1)}-${str.substr(1,6)}-${str.substr(7)}`,
    [BARCODES.EAN_8]: (str: String) => `${str.substr(0, 4)}-${str.substr(4)}`,
    [BARCODES.CODE_39]: (str: String) => `${str.substr(0, 2)}-${str.substr(2,3)}-${str.substr(5,3)}-${str.substr(8)}`
}

export const PATTERNS_BARCODES  = {
    [BARCODES.EAN]: "\d{1}\-\d{6}\-\d{6}",
    [BARCODES.EAN_8]: "\d{4}\-\d{4}",
    [BARCODES.CODE_39]: "((\d{2}|\w{2}))-((\d{3}|\w{3}))-((\d{3}|\w{3}))-((\d{4}|\w{4}))"
}



export function renderElement(tagName, className?: String, attributes?: Object, childs?: Array<HTMLElement>): HTMLElement{
    const element = document.createElement(tagName);
    const elemAttributes = attributes || {};
    const elemChilds = childs || [];
    element.className = className || "";

    Object.keys(elemAttributes).forEach((attribute) => {
        element.setAttribute(attribute, elemAttributes[attribute]);
    });
  
    elemChilds.forEach(child => {
        element.appendChild(child);
    });

    return element;
}