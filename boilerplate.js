/**
 * This file provides an `install` function that should install React Native,
 * copy over any folders and template files, and install any desired plugins.
 *
 * It's a simpler version of the one found in https://github.com/infinitered/ignite-ir-boilerplate.
 * Refer to that one to see a more full featured example of what you can do.
 *
 */

/**
 * Let's roll.
 *
 * @param {any} context - The gluegun context. Docs: https://infinitered.github.io/gluegun/#/context-api.md
 */
async function install (context) {
  const {
    filesystem,
    parameters,
    ignite,
    print,
    system
  } = context

  const APP_PATH = process.cwd()
  const PLUGIN_PATH = __dirname
  const name = parameters.third
  const APP_TEMP_PATH = `${APP_PATH}/${name}`

  const spinner = print
    .spin(`using the ${print.colors.cyan('Kryptonite')} boilerplate`)
    .succeed()

  // install create react app
  spinner.text = '▸ installing Create React App'
  spinner.start()
  await system.run('npm install create-react-app')
  spinner.text = 'installed Create React App'
  spinner.stop().succeed()

  spinner.text = '▸ Running Create React App (60 seconds-ish :)'
  spinner.start()
  await system.run('node ./node_modules/create-react-app bob')

  // Next Step. Need to move everything from 'bob' into the project root.
  filesystem.copy(`${APP_PATH}/bob`, `${APP_TEMP_PATH}/`, {
    matching: '**',
    overwrite: true
  })
  spinner.text = `Made a new React App called ${name}`
  spinner.stop().succeed()

  // Make me an ignite project :fire:
  spinner.text = '▸ Attaching ignite'
  spinner.start()

  try {
    await system.spawn(`ignite attach`)
  } catch (e) {
    ignite.log(e)
    throw e
  }

  spinner.text = `Woot! ${name} has been ignite-ified`
  spinner.stop().succeed()

  // copy our App & Tests directories
  spinner.text = '▸ installing boilerplate'
  // spinner.start()

  // have another go at installing the boilerplate, because CRA toasts it :bread:
  try {
    // pass along the debug flag if we're running in that mode
    const debugFlag = parameters.options.debug ? '--debug' : ''
    await system.spawn(`ignite add ignite-kryptonite ${debugFlag}`, { stdio: 'inherit' })
  } catch (e) {
    ignite.log(e)
    throw e
  }

  spinner.text = 'copied boilerplate'
  spinner.stop().succeed()

  // generate some templates
  spinner.text = '▸ generating files from templates'
  spinner.start()
  const templates = [
     { template: 'ignite/ignite.json.ejs', target: `ignite.js` },
     { template: 'package.json.ejs', target: `package.js` }
  ]

  await ignite.copyBatch(context, templates, { name: name, igniteVersion: ignite.version }, {
    directory: `${PLUGIN_PATH}/boilerplate`,
    quiet: true
  })

  // Remove the src directory CRA added
  filesystem.remove(`${APP_TEMP_PATH}/src`)

  // And substitute our own.
  filesystem.copy(`${PLUGIN_PATH}/boilerplate/src`, `${APP_TEMP_PATH}/src`, {
    overwrite: true
  })

  filesystem.copy(`${PLUGIN_PATH}/boilerplate/.storybook`, `${APP_TEMP_PATH}/.storybook`, {
    overwrite: true
  })

  // Add a README
  filesystem.copy(`${PLUGIN_PATH}/boilerplate/README.md`, `${APP_TEMP_PATH}/README.md`, {
    overwrite: true
  })

  filesystem.copy(`${APP_PATH}/package.js`, `${APP_TEMP_PATH}/package.json`, {
    overwrite: true
  })

  filesystem.copy(`${APP_PATH}/ignite.js`, `${APP_TEMP_PATH}/ignite/ignite.json`, {
    overwrite: true
  })
  spinner.text = 'generated files from templates'

  spinner.stop().succeed()

  process.chdir(name)

  spinner.text = '▸ installing dependencies with yarn'
  spinner.start()
  await system.run('yarn install')
  spinner.text = 'installed dependencies with yarn'
  spinner.stop().succeed()

  // install any plugins, including ourselves if we have generators.
  // please note you should always do `stdio: 'inherit'` or it'll hang

  try {
    // pass along the debug flag if we're running in that mode
    const debugFlag = parameters.options.debug ? '--debug' : ''
    await system.spawn(`ignite add ${__dirname} ${debugFlag}`, { stdio: 'inherit' })
  } catch (e) {
    ignite.log(e)
    throw e
  }

  // Cleanup
  filesystem.remove(`${APP_PATH}/ignite.js`)
  filesystem.remove(`${APP_PATH}/package.js`)
  filesystem.remove(`${APP_PATH}/bob`)
  filesystem.remove(`${APP_PATH}/package-lock.json`)
  // console.log('Reading Path Ignite: ' + `${APP_TEMP_PATH}/ignite/ignite.json`)
  // console.log(filesystem.read(`${APP_TEMP_PATH}/ignite/ignite.json`))

  // initialize git
  const gitExists = await filesystem.exists('.git')
  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
    spinner.text = 'setting up git'
    spinner.start()
    await system.run('git init . && git add . && git commit -m "Initial commit."')
    spinner.succeed()
  }

  print.info('Woot! all done.')
  print.info('🍽 Installed!')
  print.info('')
  print.info(print.colors.yellow(`  cd ${name}`))
  print.info(print.colors.yellow('  yarn start'))
}

module.exports = { install }
