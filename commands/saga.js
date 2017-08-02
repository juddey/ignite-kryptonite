// @cliDescription  Generates a saga with an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, ignite, print, strings, filesystem } = context
  const { pascalCase, isBlank, upperCase, snakeCase } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate saga <name>\n`)
    print.info('A name is required.')
    return
  }

  const name = pascalCase(parameters.first)
  const upperName = upperCase(parameters.first)
  const props = { name, upperName }

  const jobs = [{ template: `saga.ejs`, target: `src/Sagas/${name}Sagas.js` }]
  if (config.tests) {
    jobs.push({
      template: `saga-test.ejs`,
      target: `src/__tests__/Saga/${name}SagaTest.js`
    })
  }

  // make the templates
  await ignite.copyBatch(context, jobs, props)

  // Patch in redux's index.js
  const sagaName = name
  const indexFilePath = `${process.cwd()}/src/Sagas/index.js`
  const fixtureFilePath = `${process.cwd()}/src/Services/FixtureApi.js`
  const importToAdd = `import { post${sagaName}, get${sagaName}, update${sagaName}, delete${sagaName}, all${sagaName} } from './${sagaName}Sagas'`

  if (!filesystem.exists(indexFilePath)) {
    const msg = `No '${indexFilePath}' file found.  Can't add to index.js.`
    print.error(msg)
    process.exit(1)
  }

  // insert saga import
  ignite.patchInFile(indexFilePath, {
    after: "// Sagas",
    insert: importToAdd
  })

  ignite.patchInFile(indexFilePath, {
    after: "    // some sagas only receive an action",
    insert: `    takeLatest(${sagaName}Types.${upperName}_REQUEST, get${sagaName}, api),
    takeLatest(${sagaName}Types.${upperName}_ATTEMPT, post${sagaName}, api),
    takeLatest(${sagaName}Types.${upperName}_UPDATE, update${sagaName}, api),
    takeLatest(${sagaName}Types.${upperName}_DELETE, delete${sagaName}, api),`
  })


  if (!filesystem.exists(fixtureFilePath)) {
    const msg = `No '${fixtureFilePath}' file found.  Can't add to index.js.`
    print.error(msg)
    process.exit(1)
  }

  ignite.patchInFile(fixtureFilePath, {
    after: "// Functions return fixtures",
    insert: `  post${sagaName}: () => { return { ok: true, data: "21" } },
  get${sagaName}: () => { return { ok: true, data: "21" } },
  patch${sagaName}: () => { return { ok: true, data: "21" } },
  delete${sagaName}: () => { return { ok: true } },`
  })
}
