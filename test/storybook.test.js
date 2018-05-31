const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')
const R = require('ramda')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

test('writes the storybook files', async () => {
  let dir = tempy.directory()
  process.chdir(dir)
  await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-kryptonite'])
  process.chdir(APP)
  expect(jetpack.exists('package.json')).toEqual('file')
  expect(jetpack.exists('yarn.lock')).toEqual('file')
  expect(jetpack.exists('ignite/ignite.json')).toEqual('file')
  const f = jetpack.read('ignite/ignite.json', 'json')
  await jetpack.write('ignite/ignite.json', R.merge(f, {"storybooks": {}}), {jsonIndent: 2}) // eslint-disable-line
  await execa(IGNITE, ['g', 'component', 'Test'], { preferLocal: false })
  expect(jetpack.exists('src/Components/Test.js')).toEqual('file')
  expect(jetpack.exists('src/Components/Styles/TestStyle.js')).toEqual('file')
  // Check the StoryBooks files are added.
  expect(jetpack.exists('src/Components/stories/Test.story.js')).toEqual('file')
  const storyFile = jetpack.read('src/Components/stories/Test.story.js')
  expect(storyFile).toContain('Test')
  // Check the Story Index got patched.
  const storyIndex = await jetpack.read('src/Components/stories/index.js')
  expect(storyIndex).toContain('Test')
})
