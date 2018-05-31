// @cliDescription  Generates a component, styles, and an optional test.

module.exports = async function (context) {
  // grab some features
  const { parameters, strings, print, ignite, filesystem } = context
  const { pascalCase, isBlank } = strings
  const config = ignite.loadIgniteConfig()

  // validation
  if (isBlank(parameters.first)) {
    print.info(`${context.runtime.brand} generate component <name>\n`)
    print.info('A name is required.')
    return
  }

  // read some configuration
  const name = pascalCase(parameters.first)
  const props = { name }
  const jobs = [
    {
      template: 'component.ejs',
      target: `src/Components/${name}.js`
    },
    {
      template: 'component-style.ejs',
      target: `src/Components/Styles/${name}Style.js`
    },
    {
      template: 'component-messages.ejs',
      target: `src/Components/Messages/${name}Messages.js`
    }
  ]

  if (config.tests) {
    jobs.push({
      template: 'component-test.ejs',
      target: `src/__tests__/Components/${name}Test.js`
    })
  }

  console.log(config)

  if (config.storybooks) {
    jobs.push({
      template: 'component.story.ejs',
      target: `src/Components/stories/${name}.story.js`
    })
  }

  await ignite.copyBatch(context, jobs, props)

  const componentName = name
  const indexFilePath = `${process.cwd()}/src/Components/index.js`
  const storyFilePath = `${process.cwd()}/src/Components/stories/index.js`
  const importToAdd = `import ${componentName} from './${componentName}'`
  const exportToAdd = `  ${componentName},`
  const storyToAdd = `import './${componentName}.story.js'`

  if (!filesystem.exists(indexFilePath)) {
    const msg = `No '${indexFilePath}' file found.  Can't add to index.js.`
    print.error(msg)
    process.exit(1)
  }

  // insert component import
  ignite.patchInFile(indexFilePath, {
    after: '// Component Index',
    insert: importToAdd
  })

  ignite.patchInFile(indexFilePath, {
    after: 'export {',
    insert: exportToAdd
  })

  // Add Storybooks.
  if (config.storybooks) {
    ignite.patchInFile(storyFilePath, {
      after: '// Storybooks Index',
      insert: storyToAdd
    })
  }
}
