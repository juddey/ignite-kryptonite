const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000000

describe('generators', () => {
  beforeAll(async () => {
    // creates a new temp directory
    let dir = tempy.directory()
    process.chdir(dir)
    await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-kryptonite'])
    process.chdir(APP)
  })

  test('generates a component', async () => {
    await execa(IGNITE, ['g', 'component', 'Test'], { preferLocal: false })
    expect(jetpack.exists('src/Components/Test.js')).toEqual('file')
    expect(jetpack.exists('src/Components/Styles/TestStyle.js')).toEqual('file')
    const lint = await execa('yarn', ['-s', 'run', 'format'])
    expect(lint.stderr).toContain('success formatting 2 files') // 2 Files formatted are OK.
  })

  test('generate container works', async () => {
    await execa(IGNITE, ['g', 'container', 'Container'], { preferLocal: false })
    expect(jetpack.exists('src/Containers/Container.js')).toEqual('file')
    expect(jetpack.exists('src/Containers/Styles/ContainerStyle.js')).toEqual('file')
    const lint = await execa('yarn', ['-s', 'run', 'format'])
    expect(lint.stderr).toContain('files were unchanged')
    expect(lint.stderr).not.toContain('success formatting')
  })

  test('generate saga works', async () => {
    await execa(IGNITE, ['g', 'saga', 'Test'], { preferLocal: false })
    expect(jetpack.exists('src/Sagas/TestSagas.js')).toEqual('file')
    await execa('yarn', ['-s', 'run', 'format'])
  })

  test('generate screen works', async () => {
    await execa(IGNITE, ['g', 'screen', 'TestScreen'], { preferLocal: false })
    expect(jetpack.exists('src/Containers/TestScreen.js')).toEqual('file')
    expect(jetpack.exists('src/Containers/Styles/TestScreenStyle.js')).toEqual('file')
    await execa('yarn', ['-s', 'run', 'format'])
  })
})
