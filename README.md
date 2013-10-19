dom-behavior
===

[![browser support](https://ci.testling.com/mmckegg/dom-behavior.png)](https://ci.testling.com/mmckegg/dom-behavior)

Define javascript behavior for DOM elements.

## Install

[![NPM](https://nodei.co/npm/dom-behavior.png?compact=true)](https://nodei.co/npm/dom-behavior/)

## Example

```html
<html>
  <head>
    <title>Example Page</title>
  </head>
  <body>
    <div>
      Some content <button data-behavior='edit anotherBehavior'>Edit</button>
    </div>
    <div id='link' data-href='/test' data-behavior='link'>
      I'm not a link but I act like one
    </div>
  </body>
</body>
```

```js
var behave = require('dom-behavior')

var notify = behave({
  edit: function(element){
    element.onclick = function(){
      // activate editor
    }
  },
  link: function(element){
    // create a fake hyperlink

    var url = element.getAttribute('data-href')
    element.style.cursor = 'pointer'

    element.onclick = function(e){
      window.location = url
    }

    return function(message){
      if (message == 'update'){
        url = element.getAttribute('data-href')
        if (url){
          element.style.cursor = 'pointer'
        } else {
          element.style.cursor = 'default'
        }
      }
    }
  },
  anotherBehavior: function(element){
    // multiple behaviors can be added to the same element 
    // seperated by spaces. Just like html classes.
  }
}, document)

var linkDiv = document.getElementById('link')
linkDiv.setAttribute('data-href', '/new-url')

// normally this would be called from some data-binding/templating thingy.
notify('update', linkDiv)
```

### Using with [become](https://github.com/mmckegg/become), [json-context](https://github.com/mmckegg/json-context) and [rincewind](https://github.com/mmckegg/rincewind)

See [https://github.com/mmckegg/realtime-blog-example-with-browserify](https://github.com/mmckegg/realtime-blog-example-with-browserify).