## Ignite Electronite

Ignite for your next cool electron thing.

Also, conincidentally, works _sweet as_ on single page based web projects, as they share many of the same concepts.

## Warning!!!!
Warning! Warning! ~~Beta~~ ~~Alpha~~ pre-Alpha Software, breaking changes, frequent crashes, lots of bugs, all that stuff. Might not work in your use case, but I'm pretty sure it [WOMM](http://www.urbandictionary.com/define.php?term=WOMM).

Still here?

Right, all of that said, here are some instructions to get you started:

1. Install create-react-app `npm install -g create-react-app`
2. Install the ignite cli - `npm install -g ignite-cli`
3. Clone the repo - `git clone https://github.com/juddey/ignite-electron.git`
4. Set the `$IGNITE_PLUGIN_PATH` in your shell to where you cloned the repo - [why?](https://github.com/infinitered/ignite/blob/769f2a7ffb328dc951001f3f20d46f9f55d8fe57/docs/advanced-guides/creating-plugins.md#add-the-plugin-to-the-ignite-application)
5. Create your new project using create-react-app
6. Attach your project to ignite using `ignite attach` - [Docs](https://github.com/infinitered/ignite/blob/769f2a7ffb328dc951001f3f20d46f9f55d8fe57/docs/quick-start/getting-started.md#attaching-to-existing-projects)
7. Install the plugin: `ignite add ignite-electronite`

This repo assumes you're using [ant.design](https://ant.design/), but feel free to use whatever component prebuilts you like. Or roll your own. You'll just need to mod the templates to suit. If you do want to use ant.design, you'll need to follow these [instructions](https://ant.design/docs/react/use-with-create-react-app).

### Modding Templates
Easy! Just modify the templates where you cloned the repo, run `ignite add ignite-electronite`, and you'll be up-to-date. This manual faffing about will all go away when this package is published to npm.

### TODO
- Write some tests. No, really. :)
- Sort out a nested directory structure
- Add a proper boilerplate for both web and electron projects
- Fix the install so we don't have to do the above
- Remove the dependency on ant-design
- Live long and prosper. 🖖
