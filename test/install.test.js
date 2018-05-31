const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

test('writes the install files', async () => {
  let dir = tempy.directory()
  process.chdir(dir)
  await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-kryptonite'])
  process.chdir(APP)
  expect(jetpack.exists('package.json')).toEqual('file')
  expect(jetpack.exists('yarn.lock')).toEqual('file')
  expect(jetpack.exists('ignite/ignite.json')).toEqual('file')
  expect(jetpack.exists('README.md')).toEqual('file')
  expect(jetpack.exists('src')).toEqual('dir')
  expect(jetpack.exists('src/index.js')).toEqual('file')
  expect(jetpack.exists('src/Containers/index.js')).toEqual('file')
  expect(jetpack.exists('src/Components/index.js')).toEqual('file')
  expect(jetpack.exists('src/Navigation/AppNavigation.js')).toEqual('file')
  expect(jetpack.exists('public')).toEqual('dir')
  const f = jetpack.read('./package.json', 'json')
  expect(f['name']).toEqual(APP)
  expect(jetpack.list('node_modules').length).toBeGreaterThan(1)
  expect(jetpack.exists('.git')).toBe('dir')
  const lint = await execa('yarn', ['-s', 'run', 'format'])
  expect(lint.stderr).toContain('files were unchanged')
  expect(lint.stderr).not.toContain('success formatting')
  // Check for storybook.
  expect(jetpack.exists('.storybook')).toEqual('dir')
  expect(jetpack.exists('.storybook/addons.js')).toEqual('file')
  expect(jetpack.exists('.storybook/config.js')).toEqual('file')
  expect(jetpack.exists('src/Components/stories/index.js')).toEqual('file')
  // Run a build, this will catch any glaring syntax errors.
  const build = await execa('yarn', ['-s', 'run', 'build'])
  expect(build.stderr).toEqual('')
})
