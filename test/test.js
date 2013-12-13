var test = require('tape')
var behave = require('../')
var h = require('hyperscript')

require('es5-shim')

test('stuff', function(t){
  t.plan(9)

  var divWithBehaviorA = h('div', {'data-behavior': 'behaviorA'})
  var spanWithBehaviorB = h('span', {'data-behavior': 'behaviorB'})
  var divWithBothBehaviors = h('div', {'data-behavior': 'behaviorA behaviorB'})

  var rootElement = h('div', 
    divWithBehaviorA, 
    h('div', 'Some text', spanWithBehaviorB),
    divWithBothBehaviors
  )

  var behaviors = {
    behaviorA: function(element){
      t.ok(element == divWithBehaviorA || element == divWithBothBehaviors, 'behaviorA added to correct element')
      return function(change, element){
        t.ok(true, 'update triggered on behaviorA')
      }
    },
    behaviorB: function(element){
      t.ok(element == spanWithBehaviorB || element == divWithBothBehaviors, 'behaviorB added to correct element')
      return function(change, element){
        t.ok(true, 'update triggered on behaviorB')
      }
    }
  }

  var notify = behave(behaviors, rootElement)
  
  t.deepEqual(
    Object.keys(divWithBehaviorA.behaviors), 
    ['behaviorA'], 'behaviorA added to div'
  )

  t.deepEqual(
    Object.keys(spanWithBehaviorB.behaviors), 
    ['behaviorB'], 'behaviorB added to span'
  )

  t.deepEqual(
    Object.keys(divWithBothBehaviors.behaviors || {}), 
    ['behaviorA', 'behaviorB'], 
    'both added to final div'
  )

  notify('change', divWithBothBehaviors)

})

test('nested behavior', function(t){
  t.plan(2)

  var divWithBehavior = h('div', {'data-behavior': 'group.behaviorName'})

  var behaviors = {
    'group': {
      'behaviorName': function(element){
        t.ok(element == divWithBehavior, 'behavior added to correct element')
      }
    }
  }

  behave(behaviors, divWithBehavior)

  t.deepEqual(
    Object.keys(divWithBehavior.behaviors), 
    ['group.behaviorName'], 'behaviorA added to div'
  )

})

test('notifyChange "this" bound to element', function(t){
  t.plan(2)

  var divWithBehavior = h('div', {'data-behavior': 'checkBound'})

  function checker(change){
    t.equal(this, divWithBehavior)
    t.equal(change, 'change')
  }

  var behaviors = {
    'checkBound': function(element){
      return checker
    }
  }

  var notifyChange = behave(behaviors, divWithBehavior)
  notifyChange('change', divWithBehavior)
})