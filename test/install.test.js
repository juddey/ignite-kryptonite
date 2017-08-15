const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/..`

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

describe('Install', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-electronite'])
    process.chdir(APP)
  })

  fit('Writes the install files', async () => {
    console.log(jetpack.list())
    expect(jetpack.exists('package.json')).toBe('file')

  })
})
