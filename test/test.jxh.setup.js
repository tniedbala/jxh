//  standard tests

var basicElement = {
    h1: 'heading1'
}

var arrayElement = {
    p: ['paragraph1','paragraph2','paragraph3']
}

var multiElement = {
    li_a_: 'link1'
}

var multiElementArray = {
    li_a_: ['link1','link2','link3']
}

var singleElement = {
    meta$: 'charset="utf-8"'
}

var singleElementNested = {
    meta$: {
        _charset: 'utf-8'
    }
}

var singleElementArray = {
    meta$: ['charset="utf-8"','name="test-name"','description="test-description"']
}

var selfCloseElement = {
    meta$$: 'charset="utf-8"'
}

var selfCloseElementNested = {
    meta$$: {
        _charset: 'utf-8'
    }
}

var selfCloseElementArray = {
    meta$$: ['charset="utf-8"','name="test-name"','description="test-description"']
}

var nestedElements = {
    div: {
        div: {
            meta$: 'charset="utf-8"',
            meta$$: 'charset="utf-8"',
            h1: 'heading1',
            p: ['paragraph1','paragraph2','paragraph3'],
            li_a_: 'link1',
            li_a_: ['link1','link2','link3']
        }
    }
}

var basicElementAttr = {
    h1: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',
        txt: 'heading1'
    }
}

var arrayElementAttr1 =  {
    p: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',
        txt: ['paragraph1','paragraph2','paragraph3']
    }
}

var arrayElementAttr2 =  {
    p: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',
        txt: [
            'paragraph1',
            {
                _class: 'inner-class',
                txt: 'paragraph2'
            },
            'paragraph3'
        ]
    }
}

var multiElementAttr = {
    li_a_: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',
        txt: 'link1'
    }
}

var multiElementArrayAttr1 = {
    li_a_: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',
        txt: ['link1','link2','link3']
    }
}

var multiElementArrayAttr2 = {
    li_a_: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',
        txt: [
            'paragraph1',
            {
                _class: 'inner-class',
                txt: 'paragraph2'
            },
            'paragraph3'
        ]
    }
}

var nestedElementsAttr = {
    div: {
        _class: 'test-class',
        _id: 'test',
        _attr: 'data-test="test"',

        div: {
            _class: 'test-class',
            _id: 'test',
            _attr: 'data-test="test"',

            meta$: 'charset="utf-8"',
            meta$$: 'charset="utf-8"',
            h1: 'heading1',
            p: ['paragraph1','paragraph2','paragraph3'],
            li_a_: 'link1',
            li_a_: ['link1','link2','link3']
        }
    }
}

var componentObject = {
    div: {
        div: {
            $component1: nestedElements,
            $component2: nestedElementsAttr
        }
    }
}

var componentArray = {
    div: {
        div: {
            $component: [nestedElements, nestedElementsAttr]
        }
    }
}

var arrayInput = [nestedElements, nestedElementsAttr];

// --------------------------------------------------------
// v1.0.3 bug fixes

// nested attributes with no txt tag - should render open/closed tags without newline
var adjustNewline = {
    script: {
        _type: 'text/javascript',
        _src: 'test/test.js'
    }
}
// should always render tags for falsey values
var falseyValues = {
    h1: false,
    h2: null,
    h3: undefined,
    h4: NaN,
    h5: '',
    p: [false,null,undefined,NaN,'']
}
var falseyValuesAttr = {
    h1: {
        _class: 'test-class',
        txt: false
    },
    h2: {
        _class: 'test-class',
        txt: null
    },
    h3: {
        _class: 'test-class',
        txt: undefined
    },
    h4: {
        _class: 'test-class',
        txt: NaN
    },
    h5: {
        _class: 'test-class',
        txt: ''
    },
    p: {
        _class: 'test-class',
        txt: [false,null,undefined,NaN,'']
    }
}

// --------------------------------------------------------
// v1.0.4 tests

module.exports = {
    standardTests: {
        'Basic Element': basicElement,
        'Array Element': arrayElement,
        'Multi-Element': multiElement,
        'Multi-Element - Array': multiElementArray,
        'Single Element': singleElement,
        'Single Element - Nested': singleElementNested,
        'Single Element - Array': singleElementArray,
        'Self-Closing Element': selfCloseElement,
        'Self-Closing Element - Nested': selfCloseElementNested,
        'Self-Closing Element - Array': selfCloseElementArray,
        'Nested Elements': nestedElements,
        'Basic Element - Attributes': basicElementAttr,
        'Array Element - Attributes 1': arrayElementAttr1,
        'Array Element - Attributes 2': arrayElementAttr2,
        'Multi-Element - Attributes': multiElementAttr,
        'Multi-Element - Array, Attributes 1': multiElementArrayAttr1,
        'Multi-Element - Array, Attributes 2': multiElementArrayAttr2,
        'Nested Elements - Attributes': nestedElementsAttr,
        'Component Object': componentObject,
        'Component Array': componentArray,
        'Array Input': arrayInput
    },
    bugfix: {
        'Adjust Newline': adjustNewline,
        'Render Falsey Values': falseyValues,
        'Render Falsey Values - Attributes': falseyValuesAttr
    }
}