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
    system,
    template
  } = context


  const APP_PATH = process.cwd()
  const PLUGIN_PATH = __dirname
  const name = parameters.third
  const APP_TEMP_PATH = `${APP_PATH}/${name}`
  console.log(PLUGIN_PATH)


  const spinner = print
    .spin(`using the ${print.colors.cyan('Electronite')} boilerplate`)
    .succeed()

  // just need this while we're not on npm
  filesystem.remove(`${APP_PATH}/node_modules/ignite-electronite/.git`)

  // install create react app
  spinner.text = '▸ installing create-react-app'
  spinner.start()
  spinner.text = 'installing create-react-app'
  await system.run('npm install create-react-app')
  spinner.stop().succeed()

  spinner.text = '▸ Running Create React App'
  spinner.start()
  await system.run('node ./node_modules/create-react-app bob')
  spinner.text = 'Running Create React App'

  //Next Step. Need to move everything from 'bob' into the project root.
  filesystem.copy(`${APP_PATH}/bob`, `${APP_TEMP_PATH}/`, {
    matching: '**',
    overwrite: true
  })
  spinner.stop().succeed()
  // copy our App & Tests directories
  spinner.text = '▸ copying boilerplate'
  spinner.start()
  filesystem.copy(`${PLUGIN_PATH}/boilerplate/App`, `${APP_TEMP_PATH}/App`, {
    overwrite: true
  })

  spinner.text = 'copying boilerplate'
  spinner.stop().succeed()

  // generate some templates
  spinner.text = '▸ generating files from templates'
  spinner.start()
   const templates = [
     { template: 'index.js.ejs', target: 'index.js' },
     { template: 'ignite/ignite.json.ejs', target: `ignite.js` },
     { template: 'package.json.ejs', target: `package.js` }
   ]

   await ignite.copyBatch(context, templates, { name: name, igniteVersion: ignite.version }, {
     directory: `${PLUGIN_PATH}/boilerplate`,
     quiet: true
   })

  filesystem.copy(`${APP_PATH}/package.js`, `${APP_TEMP_PATH}/package.json`, {
     overwrite: true
   })

  filesystem.copy(`${APP_PATH}/ignite.js`, `${APP_TEMP_PATH}/ignite/ignite.json`, {
    overwrite: true
  })


  spinner.text = 'generating files from templates'

  spinner.stop().succeed();

  process.chdir(name)

  spinner.text = '▸ installing dependencies with yarn'
  spinner.start()
  await system.run('yarn install')
  spinner.text = 'installing dependencies with yarn'
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

  // console.log('Reading Path Ignite: ' + `${APP_TEMP_PATH}/ignite/ignite.json`)
  // console.log(filesystem.read(`${APP_TEMP_PATH}/ignite/ignite.json`))


 }

//  // initialize git
//  const gitExists = await filesystem.exists('.git')
//  if (!gitExists && !parameters.options['skip-git'] && system.which('git')) {
//    spinner.text = 'setting up git'
//    spinner.start()
//    await system.run('git init . && git add . && git commit -m "Initial commit."')
//    spinner.succeed()
//  }
//
//  // Wrap it up with our success message.
//  print.info('')
//  print.info('🍽 Installed!')
//  print.info('')
//  print.info(print.colors.yellow(`  cd ${name}`))
//  print.info(print.colors.yellow('  react-native run-ios'))
//  print.info(print.colors.yellow('  react-native run-android'))
//  print.info('')


module.exports = { install }
