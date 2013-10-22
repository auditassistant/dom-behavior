module.exports = function(behaviors, rootElement, options){
  // options: attribute, property
  options = options || {}
  options.attribute = options.attribute || 'data-behavior'
  options.property = options.property || 'behaviors'

  if (!rootElement){
    rootElement = document
  }

  walkDom(rootElement, function(node){
    if (node.getAttribute && node.getAttribute(options.attribute)){
      add(node)
    }
  })

  function add(node){
    if (!node[options.property]){
      node[options.property] = node[options.property] || {}
    }

    var behaviorNames = node.getAttribute(options.attribute).split(' ')
    behaviorNames.forEach(function(name){
      if (behaviors[name]){
        node[options.property][name] = behaviors[name](node)
      }
    })
  }

  function change(action, node){
    var nodeBehaviors = node[options.property]
    if (nodeBehaviors){
      Object.keys(nodeBehaviors).forEach(function(name){
        if (typeof nodeBehaviors[name] == 'function'){
          nodeBehaviors[name](action)
        }
      })
    }
  }

  return function(action, node){
    if (action == 'append'){
      if (node.getAttribute && node.getAttribute(options.attribute)){
        add(node)
      }
    } else {
      change(action, node)
    }
  }
}



function walkDom(rootNode, iterator){
  var currentNode = rootNode.firstChild
  while (currentNode){
    iterator(currentNode)
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