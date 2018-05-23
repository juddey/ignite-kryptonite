// @cliDescription  Generates a action/creator/reducer set for Redux.

module.exports = async function (context) {
  // grab some features
  const { parameters, ignite, strings, print, filesystem } = context
  const { isBlank, pascalCase, lowerCase } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate redux <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const lowerName = lowerCase(parameters.first)
  const props = { name }

  const jobs = [{ template: `redux.ejs`, target: `src/Redux/${name}Redux.js` }]
  if (config.tests) {
    jobs.push({
      template: `redux-test.ejs`,
      target: `src/__tests__/Redux/${name}ReduxTest.js`
    })
  }

  await ignite.copyBatch(context, jobs, props)

  // Patch in redux's index.js
  const reduxName = name
  const indexFilePath = `${process.cwd()}/src/Redux/index.js`
  const toAdd = `    ${lowerName}: require('./${name}Redux').reducer,`
  const sagaFilePath = `${process.cwd()}/src/Sagas/index.js`
  const importToAdd = `import { ${reduxName}Types } from '../Redux/${reduxName}Redux'`

  if (!filesystem.exists(indexFilePath)) {
    const msg = `No '${indexFilePath}' file found.  Can't add to index.js.`
    print.error(msg)
    process.exit(1)
  }

  // insert redux require
  ignite.patchInFile(indexFilePath, {
    after: 'const rootReducer = combineReducers',
    insert: toAdd
  })

  if (!filesystem.exists(sagaFilePath)) {
    const msg = `No '${sagaFilePath}' file found.  Can't add to index.js.`
    print.error(msg)
    process.exit(1)
  }

  // insert saga import
  ignite.patchInFile(sagaFilePath, {
    after: '// Types',
    insert: importToAdd
  })
}
