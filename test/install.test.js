const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')
const R = require('ramda')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/..`

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000

describe('Install', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-electronite'])
    process.chdir(APP)
  })

  it('writes the install files', async () => {
    expect(jetpack.exists('package.json')).toBe('file')
    expect(jetpack.exists('yarn.lock')).toBe('file')
    expect(jetpack.exists('ignite/ignite.json')).toBe('file')
    expect(jetpack.exists('README.md')).toBe('file')
    expect(jetpack.exists('src')).toBe('dir')
    expect(jetpack.exists('public')).toBe('dir')
    f = jetpack.read('./package.json', 'json')
    expect(f['name']).toEqual(APP)
    expect(jetpack.list('node_modules').length).toBeGreaterThan(1)
    expect(jetpack.exists('.git')).toBe('dir')
  })
})
