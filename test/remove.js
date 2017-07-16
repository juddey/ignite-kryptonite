const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('removes Electronite', async t => {
  const removeModule = sinon.spy()
  const removePluginComponentExample = sinon.spy()

  const context = {
    ignite: { removeModule, removePluginComponentExample }
  }

  await plugin.remove(context)

  t.true(removeModule.calledWith('react-native-MODULENAME', { unlink: true }))
  t.true(removePluginComponentExample.calledWith('ElectriniteExample.js'))
})
