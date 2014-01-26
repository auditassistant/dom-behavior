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
            if (typeof current == 'function') current.call(node, 'change')
          } else {
            ;delete nodeBehaviors[key]
            if (typeof current == 'function') current.call(node, 'remove')
          }
        })

        // add new behaviors
        behaviorNames.forEach(function(name){
          if (!(name in nodeBehaviors)){
            var behavior = getBehavior(name, behaviors)
            if (behavior){
              nodeBehaviors[name] = behavior(node)
            }
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
    } else if (change === 'update'){
      return apply(node, false)
    } else { // append
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
          current.call(node, 'remove')
        }
      })
      node[options.property] = null
    }
  })
}

function getBehavior(name, behaviors){
  if (behaviors[name]){
    return behaviors[name]
  } else if (~name.indexOf('.')){ // nested behaviors
    var parts = name.split('.')
    for (var i=0;i<parts.length;i++){
      if (behaviors && behaviors[parts[i]]){
        behaviors = behaviors[parts[i]]
      } else {
        behaviors = null
      }
    }
    return behaviors
  }
}

function walkDom(rootNode, iterator){
  var currentNode = rootNode
  while (currentNode){
    if (iterator(currentNode) === false){
      break // early escape
    }
    if (currentNode.firstChild){
      currentNode = currentNode.firstChild
    } else if (currentNode === rootNode){
      currentNode = null
    } else {
      
      while (currentNode && !currentNode.nextSibling){
        if (currentNode.parentNode !== rootNode){
          currentNode = currentNode.parentNode
        } else {
          currentNode = null
        }
      }
      currentNode = currentNode && currentNode.nextSibling
    }
  }
}