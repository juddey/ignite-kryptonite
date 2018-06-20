const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')
const R = require('ramda')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

async function runTests () {
  const response = await execa.shell('CI=true yarn run test --updateSnapshot', {stdio: 'inherit'})
  expect(response.stdout).not.toBe()
  expect(response.stderr).not.toBe()
}

test('writes the testing files', async () => {
  let dir = tempy.directory()
  process.chdir(dir)
  await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-kryptonite'])
  process.chdir(APP)
  expect(jetpack.exists('package.json')).toEqual('file')
  expect(jetpack.exists('yarn.lock')).toEqual('file')
  expect(jetpack.exists('ignite/ignite.json')).toEqual('file')
  const f = jetpack.read('ignite/ignite.json', 'json')
  await jetpack.write('ignite/ignite.json', R.merge(f, {"tests": true}), {jsonIndent: 2}) // eslint-disable-line
  await execa(IGNITE, ['g', 'component', 'Test'], { preferLocal: false })
  expect(jetpack.exists('src/Components/Test.js')).toEqual('file')
  expect(jetpack.exists('src/Components/Styles/TestStyle.js')).toEqual('file')
  // Check the test file gets added
  expect(jetpack.exists('src/__tests__/Components/TestTest.js')).toEqual('file')
  // Check the test runs and that there were no errors.
  await runTests()
  await execa(IGNITE, ['g', 'container', 'Foo'], { preferLocal: false })
  expect(jetpack.exists('src/__tests__/Containers/FooTest.js')).toEqual('file')
  await runTests()
  await execa(IGNITE, ['g', 'redux', 'Foo'], { preferLocal: false })
  expect(jetpack.exists('src/__tests__/Redux/FooReduxTest.js')).toEqual('file')
  await runTests()
  await execa(IGNITE, ['g', 'saga', 'Foo'], { preferLocal: false })
  expect(jetpack.exists('src/__tests__/Sagas/FooSagaTest.js')).toEqual('file')
  runTests()
})
