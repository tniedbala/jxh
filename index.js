module.exports = jxh;

// string constants for reserved properties, regex constants for element types

const TEXT = 'txt';
const ATTR = '_attr';
const COMPONENT = /^\$.+$/;
const ATTRTAG = /^_.+$/;
const MULTITAG = /^[^\$_].+(_.+)+_$/;
const SINGLETAG = /^[^\$_].+\$$/;
const EMPTYTAG = /^[^\$_].+[^\$]\$$/;

// main function:

function jxh(obj, indentStr = '  ', indentLevel = 0) {
    let indent = setIndent(indentStr, indentLevel);
    let html = '';
    let value = undefined;
    switch (getType(obj)) {
        case 'array':
            html += parseComponent(obj, indentStr, indentLevel);
            break;
        case 'object':
            for (let tag in obj) {
                value = obj[tag];
                if (COMPONENT.test(tag)) {
                    html += parseComponent(value, indentStr, indentLevel);
                }
                else if (SINGLETAG.test(tag)) {
                    html += singleTag(tag, value, indentStr, indentLevel);
                }
                else if (!ATTRTAG.test(tag)) {
                    switch (getType(value)) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                            html += parseString(tag, '', value, indentStr, indentLevel);
                            break;
                        case 'array':
                            html += parseArray(tag, '', value, indentStr, indentLevel);
                            break;
                        case 'object':
                            html += parseObject(tag, value, indentStr, indentLevel);
                            break;
                    }
                }
            }
            break;
        default:
            throw new TypeError(`jxh requires object or array argument.\n    Value: ${JSON.stringify(obj)}\n    Type: ${getType(obj)}\n`);
    }
    return html;
}

/* -----------------------------------------------------------------------------------
    Primary parsing functions:
        1) parseComponent()
        2) parseString()
        3) paseArray()
        4) parseObject()
----------------------------------------------------------------------------------- */

function parseComponent(obj, indentStr = '  ', indentLevel = 0) { // parse object/array components
    let html = '';
    switch (getType(obj)) {
        case 'array':
            for (let i of obj) {
                if (getType(i) != ('object')) {
                    throw new TypeError(`Array component may only contain object elements.\n    Value: ${JSON.stringify(i)}\n    Type: ${getType(i)}\n    Parent: ${JSON.stringify(obj)}\n`);
                }
                else {
                    html += jxh(i, indentStr, indentLevel);
                }
            }
            break;
        case 'object':
            html += jxh(obj, indentStr, indentLevel);
            break;
    }
    return html;
}

function parseString(tag, outerAttributes, value, indentStr, indentLevel) { // parse string, number, boolean elements
    let indent = setIndent(indentStr, indentLevel);
    let html = '';
    if (MULTITAG.test(tag)) {
        html += `${indent}${multiTag(tag, outerAttributes, value, indentStr, indentLevel)}\n`;
    }
    else {
        html += `${indent}<${tag + outerAttributes}>${value}</${tag}>\n`;
    }
    return html;
}

function parseArray(tag, outerAttributes, arr, indentStr, indentLevel) { // parse array elements
    let indent = setIndent(indentStr, indentLevel);
    let html = '';
    let attributeTag = undefined;
    for (let item of arr) {
        switch (getType(item)) {
            case 'string':
            case 'number':
            case 'boolean':
                html += parseString(tag, outerAttributes, item, indentStr, indentLevel);
                break;
            case 'object':
                if (MULTITAG.test(tag)) {
                    html += `${indent}${multiTag(tag, outerAttributes, item, indentStr, indentLevel)}\n`;
                }
                else {
                    attributeTag = tag + getAttributes(item);
                    if (item[TEXT] || item[TEXT] === '') {
                        html += `${indent}<${attributeTag}>${item[TEXT]}</${tag}>\n`;
                    }
                    else {
                        html += `${indent}<${attributeTag}>\n${jxh(item, indentStr, ++indentLevel)}${indent}</${tag}>\n`;
                    }
                }
                break;
            case 'array':
                throw new TypeError(`Object.${TEXT} arrays may only contain string, number, boolean or object types.\n    Value: ${JSON.stringify(item)}\n    Type: ${getType(item)}\n    Parent: ${JSON.stringify(arr)}\n`);
        }
    }
    return html;
}

function parseObject(tag, obj, indentStr, indentLevel) { // parse nested objects
    let indent = setIndent(indentStr, indentLevel);
    let attributeTag = tag + getAttributes(obj);
    if (obj[TEXT] || obj[TEXT] === '') {
        switch (getType(obj[TEXT])) {
            case 'string':
            case 'number':
            case 'boolean':
                return parseString(tag, getAttributes(obj), obj[TEXT], indentStr, indentLevel);
            case 'array':
                return parseArray(tag, getAttributes(obj), obj[TEXT], indentStr, indentLevel);
            case 'object':
                throw new TypeError(`Object.${TEXT} limited to string, number, boolean or array types.\n    Value: ${JSON.stringify(obj[TEXT])}\n    Type: ${getType(obj[TEXT])}\n    Parent: ${JSON.stringify(obj)}\n`);
        }
    }
    else {
        if (MULTITAG.test(tag)) {
            return `${indent}${multiTag(tag, getAttributes(obj), obj, indentStr, indentLevel)}\n`;
        }
        else {
            return `${indent}<${attributeTag}>\n${jxh(obj, indentStr, ++indentLevel)}${indent}</${tag}>\n`;
        }
    }
}

/* -----------------------------------------------------------------------------------
    Tag formatting functions:
        1) singleTag()
        2) multiTag()
        3) getAttributes()
----------------------------------------------------------------------------------- */

function singleTag(tag, obj, indentStr, indentLevel) { // handle empty/self-closing tags
    let indent = setIndent(indentStr, indentLevel);
    let tagClose = EMPTYTAG.test(tag) ? '>' : '/>';
    let html = '';
    tag = EMPTYTAG.test(tag) ? tag.replace('$', '') : tag.replace('$$', '');
    switch (getType(obj)) {
        case 'string':
        case 'number':
        case 'boolean':
            html += `${indent}<${tag} ${obj}${tagClose}\n`;
            break;
        case 'object':
            html += `${indent}<${tag}${getAttributes(obj)}${tagClose}\n`;
            break;
        case 'array':
            for (let i of obj) {
                switch (getType(i)) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        html += `${indent}<${tag} ${i}${tagClose}\n`;
                        break;
                    case 'object':
                        html += `${indent}<${tag}${getAttributes(i)}${tagClose}\n`;
                        break;
                    case 'array':
                        throw new TypeError(`Single-element arrays may only contain string, number, boolean or object types.\n    Value: ${JSON.stringify(i)}\n    Type: ${getType(i)}\n    Parent: ${JSON.stringify(obj)}\n`);
                }
            }
            break;
    }
    return html;
}

function multiTag(tagStr, outerAttributes, value, indentStr = '  ', indentLevel = 0) { // handle underscore delimitted/suffixed property names
    let indent = setIndent(indentStr, indentLevel);
    let tagArray = tagStr.split(/_/);
    let tag = undefined;
    let tagOpen = '';
    let tagClose = '';
    for (let i = 0; i < tagArray.length - 1; i++) {
        tag = tagArray[i];
        if (tag === tagArray[tagArray.length - 2]) {
            if (getType(value) === 'object') {
                tagOpen += `<${tag + getAttributes(value)}>`;
                tagClose = `</${tag}>` + tagClose;
            }
            else {
                tagOpen += `<${tag + outerAttributes}>`;
                tagClose = `</${tag}>` + tagClose;
            }
        }
        else {
            tagOpen += `<${tag}>`;
            tagClose = `</${tag}>` + tagClose;
        }
    }
    if (getType(value) === 'object') {
        if (value[TEXT] || value[TEXT] === '') {
            return tagOpen + value[TEXT] + tagClose;
        }
        else {
            return `${tagOpen}\n${jxh(value, indentStr, ++indentLevel)}${indent}${tagClose}`;
        }
    }
    else {
        return tagOpen + value + tagClose;
    }
}

function getAttributes(obj) { // returns attribute string from a nested object containing attribute properties
    let attrArray = Object.keys(obj);
    let attrString = '';
    let attrTag = '_attr';
    for (let tag of attrArray) {
        if (tag != '_attr') {
            if (ATTRTAG.test(tag)) {
                attrString += ` ${tag.replace('_', '')}="${obj[tag]}"`;
            }
        }
    }
    if (obj._attr) {
        attrString += ' ' + obj._attr;
    }
    return attrString;
}

/* -----------------------------------------------------------------------------------
    Other helper functions:
        1) setIndent()
        2) getType()
----------------------------------------------------------------------------------- */

function setIndent(indentStr, indentLevel) { // returns indentation string
    let indent = '';
    for (let i = 0; i < indentLevel; i++) {
        indent += indentStr;
    }
    return indent;
}

function getType(obj) { // returns type of object, specifying array, NaN and null values
    if (obj) {
        return Array.isArray(obj) ? 'array' : typeof (obj);
    }
    else {
        switch (typeof (obj)) {
            case 'number':
                return obj === 0 ? 'number' : 'NaN';
            case 'object':
                return 'null';
            default:
                return typeof (obj);
        }
    }
}
