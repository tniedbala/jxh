// special tag constants
const TEXT = 'txt';
const ATTR = '_attr';
const ATTRTAG = /^_.+$/;
const COMPONENT = /^\$.+$/;

// composite of tag patterns & rendering functions
var Tag = {
    tags: {
        singleTag: {
            pattern: /^[^\$_].+[^\$]\$$/,
            render: singleTag
        },
        closedTag: {
            pattern: /^[^\$_].+\$\$$/,
            render: closedTag
        },
        multiTag: {
            pattern: /^[^\$_].+(_.+)+_$/,
            render: multiTag
        },
        standardTag: {
            pattern: /^[^$_].*[^$_]$|^[^$_]{1}$/,
            render: standardTag
        }
    },
    render: function(indent, tag, attrs, content) {
        for (let tagName in this.tags) {
            let tagObj = this.tags[tagName];
            if (tagObj.pattern.test(tag)) {
                return tagObj.render(indent, tag, attrs, content);
            }
        }
        return '';
    }
}

//------------------------------
// html rendering functions:
//------------------------------

// ie: meta$
function singleTag(indent, tag, attrs, content) {
    tag = tag.replace(/\$$/,'');
    attrs = getClosedAttr(content, attrs);
    return `${indent}<${tag + attrs}>\n`;
}
// ie: meta$$
function closedTag(indent, tag, attrs, content) {
    tag = tag.replace(/\$\$$/,'');
    attrs = getClosedAttr(content, attrs);
    return `${indent}<${tag + attrs}/>\n`;
}
// ie: li_a_
function multiTag(indent, tag, attrs, content) {
    tagArray = tag.replace(/_$/,'').split('_');
    openTag = tagArray.join('><');
    closeTag = tagArray.reverse().join('></');
    return `${indent}<${openTag + attrs}>${content}</${closeTag}>\n`;
}
// ie: h1
function standardTag(indent, tag, attrs, content) {
    return `${indent}<${tag + attrs}>${content}</${tag}>\n`;
}

//------------------------------
// other utility functions:
//------------------------------

// return empty string for null/undefined/Nan values
function renderFalsey(content) {
    let contentType = getType(content);
    switch(contentType) {
        case 'null':
        case 'undefined':
        case 'NaN':
            return contentType;
        default:
            return content;
    }
}
// test if object contains nested elements
function isNested(obj) {
    if (getType(obj)==='object') {
        for (let tag in obj) {
            if (tag != TEXT && !ATTRTAG.test(tag)) {
                return true;
            }
        }
    }
}
// return attribute string
function getAttributes(obj) {
    let attrString = '';
    let attrArray = Object.keys(obj);
    for (let tag of attrArray) {
        if (tag != ATTR && ATTRTAG.test(tag)) {
            attrString += ` ${tag.replace('_', '')}="${obj[tag]}"`;
        }
    }
    if (ATTR in obj) {
        attrString += ' ' + obj[ATTR];
    }
    return attrString;
}
// return attribute string for single/closed tags
function getClosedAttr(content, attrs) {
    if (getType(content)==='object') {
        return attrs;
    } else {
        return content ? ' ' + content : attrs;
    }
}
// returns type of obj, specifying array, NaN & null values
function getType(obj) {
    let typeStr = typeof(obj);
    if (obj) {
        return Array.isArray(obj) ? 'array' : typeStr;
    } else {
        switch (typeStr) {
            case 'number':
                return obj === 0 ? 'number' : 'NaN';
            case 'object':
                return 'null';
            default:
                return typeStr;
        }
    }
}

//------------------------------

module.exports = {
    Tag: Tag,
    renderFalsey: renderFalsey,
    isNested: isNested,
    getAttributes: getAttributes,
    getType: getType,
    TEXT: TEXT,
    COMPONENT: COMPONENT
}
