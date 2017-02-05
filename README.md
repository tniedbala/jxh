# jxh

Convert JavaScript objects to XML / HTML.

## Install

```sh
npm install jxh
```

## Example
Additional functionality is included. See object syntax reference for full documentation.

```js
var obj = {
    div : {
        h1 : 'Heading 1',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div>
  <h1>Heading 1</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
```

## Function Syntax

```js
jxh(obj, indentString, indentLevel);
```
- **obj** : *Required*. Object or array of objects parsed to XML / HTML.
- **indentString** : *Optional*. String, basic unit of indentation. Default = 2 spaces.
- **indentLevel** : *Optional*. Number, initial level of indentation. Default = 0.

## Object Syntax

### 1. Elements

#### 1.1. Basic Elements
Object property names and values are transformed into element tags and inner content:
```js
var obj = {
    h1 : 'Heading 1',
    h2 : 'Heading 2',
    p : 'paragraph1'
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<p>paragraph1</p>
```

#### 1.2. Empty & Self-Closing Elements
Suffix property names with a single or double dollar sign to create empty/self-closing elements:
```js
var obj = {
    meta$ : 'charset="utf-8"', // $ = empty element
    meta$$ : 'charset="utf-8"' // $$ = self-closing element
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<meta charset="utf-8">
<meta charset="utf-8"/>
```

#### 1.3. Grouped Elements
Use arrays to quickly create groups of elements having the same tag name:
```js
var obj = {
    p : ['paragraph1', 'paragraph2', 'paragraph3']
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<p>paragraph1</p>
<p>paragraph2</p>
<p>paragraph3</p>
```
Arrays can also be used in combination with empty/self-closing elements:
```js
let obj = {
    meta$ : ['charset="utf-8"','name="description"'],
    meta$$ : ['charset="utf-8"','name="description"'],
}
let html = jxh(obj);
console.log(html);
```
Output:
```
<meta charset="utf-8">
<meta name="description">
<meta charset="utf-8"/>
<meta name="description"/>
```

#### 1.4. Nested Elements

##### 1.4.1. Nested Objects
Create nested elements by nesting objects. There is no limit to the number of nested objects or level of nesting:

```js
var obj = {
    div : {
        h1 : 'Heading 1'
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div>
  <h1>Heading 1</h1>
</div>
```
##### 1.4.2. Underscores

Alternatively, nested elements can be created by delimitting and suffixing property names with an underscore:
```js
var obj = {
    div_h1_ : 'Heading 1'
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div><h1>Heading 1</h1></div>
```

Note that underscore delimitted/suffixed property names can be used in combination with array properties:
```js
var obj = {
    li_a_ : ['Home', 'About Us', 'Products', 'Careers', 'Contact']
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<li><a>Home</a></li>
<li><a>About Us</a></li>
<li><a>Products</a></li>
<li><a>Careers</a></li>
<li><a>Contact</a></li>
```


### 2. Attributes

#### 2.1. Basic Attributes

##### 2.1.1. Individual Attributes
Prefix any property name with an underscore to create an attribute. Add inner text using the 'txt' property:
```js
var obj = {
    h1 : {
        _class : 'headings',
        _id : 'topHeading',
        txt : 'Heading 1'
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<h1 class="headings" id="topHeading">Heading 1</h1>
```

##### 2.1.2. Generic Attribute Property
Alternatively, the generic '_attr' property can be used to add any number of attributes in a single string value:
```js
var obj = {
    h1 : {
        _attr: 'class="headings" id="topHeading"',
        txt : 'Heading 1'
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<h1 class="headings" id="topHeading">Heading 1</h1>
```

##### 2.1.3. Individual Attributes + Generic Attribute Property
When used in combination, the generic '_attr' property is appended to individual attribute properties:
```js
var obj = {
    h1 : {
        _class : 'headings',
        _attr: 'id="topHeading"',
        txt : 'Heading 1'
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<h1 class="headings" id="topHeading">Heading 1</h1>
```

#### 2.2. Empty & Self-Closing Element Attributes

Attributes can be added as simple string values to empty/self-closing elements:

```js
var obj = {
    meta$ : 'charset="utf-8"',
    meta$$ : 'charset="utf-8"'
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<meta charset="utf-8">
<meta charset="utf-8"/>
```
Alternatively, attribute properties can be added to empty/self-closing elements by including a nested object:

```js
var obj = {
    meta$ : {
        _charset : 'utf-8'
    },
    meta$$ : {
        _charset : 'utf-8'
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<meta charset="utf-8">
<meta charset="utf-8"/>
```

#### 2.3. Attributes & Grouped Elements

Attributes declared outside of an array will apply to all elements in the group:

```js
var obj = {
    p : {
        _class : 'outerClass',
        txt : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<p class="outerClass">paragraph1</p>
<p class="outerClass">paragraph2</p>
<p class="outerClass">paragraph3</p>
```

To add attributes to individual items, add an object containing attribute properties to the array:

```js
var obj = {
    p : [
        'paragraph1',
        {_class:'innerClass', txt:'paragraph2'},
        'paragraph3'
    ]
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<p>paragraph1</p>
<p class="innerClass">paragraph2</p>
<p>paragraph3</p>
```

When used together, inner attributes will override outer attributes:

```js
var obj = {
    p : {
        _class : 'outerClass',
        txt : [
            'paragraph1',
            {_class:'innerClass', txt:'paragraph2'},
            'paragraph3'
        ]
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<p class="outerClass">paragraph1</p>
<p class="innerClass">paragraph2</p>
<p class="outerClass">paragraph3</p>
```

#### 2.4. Attributes & Nested Elements

Attribute properties will always be applied to their immediate parent object. Do not use the 'txt' property to add nested objects - simply add additional properties to include additional child elements.
```js
var obj = {
    div : {
        _class : 'container-top',

        h1 : {
            _class : 'headings',
            txt : 'Heading 1'
        }
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div class="container-top">
  <h1 class="headings">Heading 1</h1>
</div>
```
For property names delimitted/suffixed with an underscore, attributes are only applied to the innermost element:

```js
var obj = {
    div_h1_ : {
        _class : 'headings',
        txt : 'Heading 1'
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div><h1 class="headings">Heading 1</h1></div>
```

### 3. Components

#### 3.1. Component Objects

Component objects are created by prefixing a property name with a dollar sign. Descriptive names can be given to component properties and the property name will not be parsed as an xml/html tag name. Any number of components may be nested at any level within an object.

```js
var obj = {
    $section1 : {
        div : {
            _class : 'container-top',
            h1 : 'Heading 1',
            p : ['paragraph1', 'paragraph2', 'paragraph3']
        }
    },
    $section2 : {
        div : {
            _class : 'container-mid',
            h1 : 'Heading 2',
            p : ['paragraph1', 'paragraph2', 'paragraph3']
        }
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div class="container-top">
  <h1>Heading 1</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
<div class="container-mid">
  <h1>Heading 2</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
```

#### 3.2. Component Arrays

Like component objects, component arrays can be created by prefixing a property name with a dollar sign. This is a convenient pattern for embedding external variables as components within an object.

```js
var section1 = {
    div : {
        _class : 'container-top',
        h1 : 'Heading 1',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var section2 = {
    div : {
        _class : 'container-mid',
        h1 : 'Heading 2',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var obj = {
    $mainContent : [section1, section2]
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div class="container-top">
  <h1>Heading 1</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
<div class="container-mid">
  <h1>Heading 2</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
```

#### 3.3. Array Arguments

In addition to accepting object arguments, jxh will also parse an array of objects:

```js
var section1 = {
    div : {
        _class : 'container-top',
        h1 : 'Heading 1',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var section2 = {
    div : {
        _class : 'container-mid',
        h1 : 'Heading 2',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var html = jxh([section1, section2]);
console.log(html);
```
Output:
```
<div class="container-top">
  <h1>Heading 1</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
<div class="container-mid">
  <h1>Heading 2</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
```

### 4. Indentation

jxh accepts 2 optional arguments intended to define the type and level of indentation used when generating xml/html strings:

```js
jxh(obj, indentString = '  ', indentLevel = 0);
```

#### 4.1. Indent String

The default unit of indentation is two spaces. Including an alternative indentString argument  will yield different output:

```js
var obj = {
    div : {
        div : {
            h1 : 'Heading 1'
        }
    }
}
var defaultIndent = jxh(obj);
var doubleTab = jxh(obj, '\t\t');
console.log(defaultIndent, doubleTab);
```
Output:
```
<div>
  <div>
    <h1>Heading 1</h1>
  </div>
</div>

<div>
		<div>
				<h1>Heading 1</h1>
		</div>
</div>
```

#### 4.2. Indent Level

The level of indentation may also be included as an argument. This is the number of indentation units applied to the top-level element(s) within the parsed object. The default indent level is zero:

```js
var obj = {
    div : {
        div : {
            h1 : 'Heading 1'
        }
    }
}
var defaultIndent = jxh(obj);
var level3 = jxh(obj, '  ', 3);
console.log(defaultIndent, level3);
```
Output:
```
<div>
  <div>
    <h1>Heading 1</h1>
  </div>
</div>

      <div>
        <div>
          <h1>Heading 1</h1>
        </div>
      </div>
```

### 5. Object Syntax Summary

The following property types and syntax are available to create the following types of elements. Incorrect object patterns may result in type errors or omitted elements.

#### 5.1. Property Type

Assuming no special prefix/suffixes are added to property names, the following types will create the following elements:

| Property Type     		| Element Type 		|
| :------------------------	|:------------------|
| String, number, boolean	| Simple Element 	|
| Array						| Grouped Elements	|
| Object					| Nested Elements	|

#### 5.2. Property Name

The following property name prefixes/suffixes create the following elements. Note that if used in comination, property name prefixes always override suffixes.

| Prefix/Suffix     		| Symbol	 		| Element Type										|
| :------------------------	|:------------------|:--------------------------------------------------|
| Prefix					| $				 	| Object/Array Component							|
| Prefix					| \_				| Attribute											|
| Suffix					| $					| Empty Element										|
| Suffix					| $$				| Self-Closing Element								|
| Suffix					| \_  				| Nested Elements (include underscore delimiter)	|

Additionally, the following property names are reserved, and may only be of the following types:

| Property Name	| Property Type 						| Element Type					|
| :-------------|:--------------------------------------| :-----------------------------|
| \_attr		| String, number, boolean	 			| Generic attribute property	|
| txt			| String, number, boolean, array		| Element inner text			|


### 6. Version History

| Version     				| Description 		|
| :------------------------	|:------------------|
| 1.0.0						| Initial Release 	|
| 1.0.1						| Add github repo 	|
