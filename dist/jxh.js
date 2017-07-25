const {
    Tag,
    renderFalsey,
    isNested,
    getAttributes,
    getType,
    TEXT,
    COMPONENT
} = require('../lib/renderUtility');

module.exports = jxh;

// main function - entry point for object & array arguments
function jxh(obj, indentStr = '  ', indentLevel = 0) {
    let html = '';
    switch (getType(obj)) {
        case 'array':
            for (let item of obj) {
                html += jxh(item, indentStr, indentLevel);
            }
            break;
        case 'object':
            for (let tag in obj) {
                let content = obj[tag];
                html += routeTags(tag, content, indentStr, indentLevel);
            }
            break;
        default:
            objTypeError(obj);
            break;
    }
    return html;
}

// route object members to appropriate parsing function based on member type
function routeTags(tag, content, indentStr, indentLevel) {
    if (COMPONENT.test(tag)) {
        return jxh(content, indentStr, indentLevel);
    } else {
        let attrs = getType(content)==='object' ? getAttributes(content) : '';
        switch (getType(content)) {
            case 'null':
            case 'undefined':
            case 'NaN':
            case 'string':
            case 'number':
            case 'boolean':
                return renderElement(tag, attrs, content, indentStr, indentLevel);
                break;
            case 'array':
                return parseArray(tag, attrs, content, indentStr, indentLevel);
                break;
            case 'object':
                return parseObject(tag, attrs, content, indentStr, indentLevel);
                break;
            default:
                objTypeError(content);
                break;
        }
    }
}

// array members - pass each item of array to renderElement()
function parseArray(tag, attrs, content, indentStr, indentLevel) {
    let html = '';
    for (let item of content) {
        if (getType(item)==='object') {
            let innerAttrs = getAttributes(item);
            let innerContent = TEXT in item ? item[TEXT] : '';
            html += renderElement(tag, innerAttrs, innerContent, indentStr, indentLevel);
        } else {
            html += renderElement(tag, attrs, item, indentStr, indentLevel);
        }
    }
    return html;
}

// object members - test for txt property & pass to renderElement() or parseArray() if a nested array
function parseObject(tag, attrs, content, indentStr, indentLevel) {
    if (TEXT in content) {
        let args = [tag, attrs, content[TEXT], indentStr, indentLevel];
        return getType(content[TEXT])==='array' ? parseArray.apply(this, args) : renderElement.apply(this, args);
    } else {
        content = isNested(content) ? content : '';
        return renderElement(tag, attrs, content, indentStr, indentLevel);
    }
}

// target for all intermediate parsing functions; calls renderTools.Tag.render() & returns html string
function renderElement(tag, attrs, content, indentStr, indentLevel) {
    let indent = indentStr.repeat(indentLevel);
    content = renderFalsey(content);
    content = isNested(content) ? ('\n' + jxh(content, indentStr, ++indentLevel) + indent) : content;
    return Tag.render(indent, tag, attrs, content);
}

// throw type error for invalid obj members
function objTypeError(obj) {
     throw new TypeError(`jxh requires object or array argument.\n\tValue: ${JSON.stringify(obj)}`);
}