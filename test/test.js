var test = require('tape')
var behave = require('../')
var h = require('hyperscript')

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

  var notifyChange = behave(behaviors, rootElement)
  
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

  notifyChange('update', divWithBothBehaviors)

})