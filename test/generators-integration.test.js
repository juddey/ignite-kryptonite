const execa = require('execa')
const jetpack = require('fs-jetpack')
const tempy = require('tempy')

const IGNITE = 'ignite'
const APP = 'IntegrationTest'
const BOILERPLATE = `${__dirname}/..`

// calling the ignite cli takes a while
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000000

describe('generators', () => {
  beforeAll(async () => {
    // creates a new temp directory
    process.chdir(tempy.directory())
    await execa(IGNITE, ['new', `${APP}`, '-b', 'ignite-electronite'])
    process.chdir(APP)
  })

  fit('generates a component', async () => {
    console.log(process.cwd())
    await execa(IGNITE, ['g', 'component', 'Test'], { preferLocal: false })
    expect(jetpack.exists('src/Components/Test.js')).toBe('file')
    expect(jetpack.exists('src/Components/Styles/TestStyle.js')).toBe('file')
    const lint = await execa('npm', ['-s', 'run', 'lint'])
    expect(lint.stderr).toBe('')
  })


  it('generate container works', async () => {
    await execa(IGNITE, ['g', 'container', 'Container'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/Container.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/ContainerStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  it('generate saga works', async () => {
    await execa(IGNITE, ['g', 'saga', 'Test'], { preferLocal: false })
    expect(jetpack.exists('App/Sagas/TestSagas.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })

  it('generate screen works', async () => {
    await execa(IGNITE, ['g', 'screen', 'Test'], { preferLocal: false })
    expect(jetpack.exists('App/Containers/TestScreen.js')).toBe('file')
    expect(jetpack.exists('App/Containers/Styles/TestScreenStyle.js')).toBe('file')
    const lint = await execa('npm', ['run', 'lint'])
    expect(lint.stderr).toBe('')
  })
})
