# jxh

Convert JavaScript objects to XML / HTML.

## Install

```sh
npm install jxh
```

## Function Syntax

```js
jxh(obj, indentString, indentLevel);
```
- **obj** : *Required*. Object or array of objects.
- **indentString** : *Optional*. String, basic unit of indentation. Default = 2 spaces.
- **indentLevel** : *Optional*. Number, initial level of indentation. Default = 0.

## Examples

### Basic Elements

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

### Attributes

```js
var obj = {
        div : {
            _id : 'main-content',
            _class : 'box-top',

            h1 : {
                _class : 'heading',
                txt : 'Heading 1'
            },
            p : {
                _class : 'pgph',
                txt : ['paragraph1', 'paragraph2', 'paragraph3']
        }
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div id="main-content" class="box-top">
  <h1 class="heading">Heading 1</h1>
  <p class="pgph">paragraph1</p>
  <p class="pgph">paragraph2</p>
  <p class="pgph">paragraph3</p>
</div>
```

### Attributes - Alternative Syntax

```js
var obj = {
        div : {
            _id : 'main-content',
            _attr : 'class="box-top"', // generic _attr property

            h1 : {
                _attr : 'class="heading"',
                txt : 'Heading 1'
            },
            p : {
                _class : 'outer-pgph', // outer attribute
                txt : [
                    'paragraph1', 
                    {_class : 'inner-pgph', txt : 'paragraph2'}, // inner attribute
                    'paragraph3'
                ]
        }
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div id="main-content" class="box-top">
  <h1 class="heading">Heading 1</h1>
  <p class="outer-pgph">paragraph1</p>
  <p class="inner-pgph">paragraph2</p>
  <p class="outer-pgph">paragraph3</p>
</div>
```

### Other Elements

```js
var obj = {
    meta$ : 'charset="utf-8"', // $ = empty element 
    meta$$ : 'charset="utf-8"', // $$ = self-closing element 
    div_h1_ : 'Heading 1', // quick nested elements
    div_span_p_ : ['paragraph1', 'paragraph2', 'paragraph3']
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<meta charset="utf-8">
<meta charset="utf-8"/>
<div><h1>Heading 1</h1></div>
<div><span><p>paragraph1</p></span></div>
<div><span><p>paragraph2</p></span></div>
<div><span><p>paragraph3</p></span></div>
```

### Component Objects

```js
var obj = {
    $section1 : { // prefix with $ to parse inner-content only
        div : {
            h1 : 'Heading 1',
            p : ['paragraph1', 'paragraph2', 'paragraph3']
        }
    },
    $section2 : {
        div : {
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
<div>
  <h1>Heading 1</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
<div>
  <h1>Heading 2</h1>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
```

### Component Arrays

```js
var section1 = {
    div : {
        h2 : 'Section 1',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var section2 = {
    div : {
        h2 : 'Section 2',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var obj = {
    div : {
        div : {
            h1: 'Heading 1'
        },
        $subSections : [section1, section2] // component array
    }
}
var html = jxh(obj);
console.log(html);
```
Output:
```
<div>
  <div>
    <h1>Heading 1</h1>
  </div>
  <div>
    <h2>Section 1</h2>
    <p>paragraph1</p>
    <p>paragraph2</p>
    <p>paragraph3</p>
  </div>
  <div>
    <h2>Section 2</h2>
    <p>paragraph1</p>
    <p>paragraph2</p>
    <p>paragraph3</p>
  </div>
</div>
```

### Array Arguments

```js
var section1 = {
    div : {
        h2 : 'Section 1',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var section2 = {
    div : {
        h2 : 'Section 2',
        p : ['paragraph1', 'paragraph2', 'paragraph3']
    }
}
var html = jxh([section1, section2]); // jxh accepts array arguments
console.log(html);
```
Output:
```
<div>
  <h2>Section 1</h2>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
<div>
  <h2>Section 2</h2>
  <p>paragraph1</p>
  <p>paragraph2</p>
  <p>paragraph3</p>
</div>
```

## Indentation

jxh accepts 2 optional arguments intended to define the type and level of indentation used when generating xml/html strings:

```js
jxh(obj, indentString = '  ', indentLevel = 0);
```

### indentString

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

### indentLevel

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

## Object Syntax Summary

The following property types and syntax are available to create the following types of elements. Incorrect object patterns may result in type errors or omitted elements.

### Property Type

Assuming no special prefix/suffixes are added to property names, the following types will create the following elements:

| Property Type     		| Element Type 		|
| :------------------------	|:------------------|
| String, number, boolean	| Simple Element 	|
| Array						| Grouped Elements	|
| Object					| Nested Elements	|

### Property Name

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


## Version History

| Version     				| Description 		|
| :------------------------	|:------------------|
| 1.0.0						| Initial Release 	|
| 1.0.1						| Add github repo 	|
| 1.0.2						| Documentation updates 	|
| 1.0.3						| Documentation updates 	|

