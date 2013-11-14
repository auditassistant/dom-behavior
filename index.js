module.exports = function(behaviors, rootElement, options){
  // options: attribute, property
  options = options || {}
  options.attribute = options.attribute || 'data-behavior'
  options.property = options.property || 'behaviors'

  if (!rootElement){
    rootElement = document
  }


  function apply(rootElement, recursive){
    walkDom(rootElement, function(node){

      if (!recursive && node !== rootElement){
        return false // break
      } else if (recursive === 'inner' && node === rootElement){
        return // continue
      }

      if (node.getAttribute && node.getAttribute(options.attribute)){
        if (!node[options.property]){
          node[options.property] = node[options.property] || {}
        }

        var behaviorNames = node.getAttribute(options.attribute).split(' ')
        var nodeBehaviors = node[options.property]

        // trigger updates or removes
        Object.keys(nodeBehaviors).forEach(function(key){
          var current = nodeBehaviors[key]
          if (~behaviorNames.indexOf(key)){
            if (typeof current == 'function') current('change')
          } else {
            nodeBehaviors[key] = null
            if (typeof current == 'function') current('remove')
          }
        })

        // add new behaviors
        behaviorNames.forEach(function(name){
          if (behaviors[name] && !nodeBehaviors[name]){
            nodeBehaviors[name] = behaviors[name](node)
          }
        })
      }
    })
  }

  apply(rootElement, true)

  return function(change, node){
    if (change === 'remove'){
      remove(node, options)
    } else if (change === 'inner'){
      apply(node, 'inner')
    } else if (change === 'attributes'){
      apply(node, false)
    } else {
      apply(node, true)
    }
  }

}

var remove = module.exports.remove = function(rootElement, options){
  walkDom(rootElement, function(node){
    if (node.getAttribute && node.getAttribute(options.attribute) && node[options.property]){
      var nodeBehaviors = node[options.property]
      Object.keys(nodeBehaviors).forEach(function(key){
        var current = nodeBehaviors[key]
        if (typeof current == 'function'){
          current('remove')
        }
      })
      node[options.property] = null
    }
  })
}

function walkDom(rootNode, iterator){
  var currentNode = rootNode.firstChild
  while (currentNode){
    if (iterator(currentNode) === false){
      break // early escape
    }
    if (currentNode.firstChild){
      currentNode = currentNode.firstChild
    } else {
      while (currentNode && !currentNode.nextSibling){
        if (currentNode !== rootNode) {
          currentNode = currentNode.parentNode
        } else {
          currentNode = null
        }
      }
      currentNode = currentNode && currentNode.nextSibling
    }
  }
}