## Ignite Kryptonite

Ignite for React-based Single Page Web Apps

#### Why?

 * you shouldn't need to be Superman (or Wonderwoman) to write a web app these days.
 * its fun to share stuff (but perhaps not :toothbrushes:)
 * I like to give back.

## Warning!!!!
Warning! Warning! ~~Beta~~ ~~Alpha~~ pre-Alpha Software, `0.1.0` release, breaking changes, frequent crashes, lots of bugs, all that stuff. Might not work in your use case, but I'm pretty sure it [WOMM](http://www.urbandictionary.com/define.php?term=WOMM). Having said this though, the component/container generators and basic structure of the project should be sound.

Still here? Cool.

Here are some instructions to get you started:

- Install the ignite cli, if you haven't done so already - `npm install -g ignite-cli`
  - ProTip: That'll require you to install the `react-native-cli` too, but we'll be taking that away (hopefully soon!)
- Run the following command - `ignite new MyAwesomeThing -b ignite-kryptonite`
  - ProTip: the -b switch means "Use this boilerplate"
- Thats it. Really.

This repo makes no assumptions about your component library, so you can install whatever you like (or none at all).

### Driving it :car: ?
You can use the following commands:

```
Type ignite generate ________ to run one of these generators:

  component   Generates a component and styles.
  container   Generates a redux smart component.
  crudsaga    Generates a saga.
  crudredux   Generates a action/creator/reducer set for Redux.        
  saga        Generates a saga                
  redux       Generates a action/creator/reducer set for Redux.        
  screen      Generates a redux smart component.  
```

### Don't like my templates?
Hey, that's cool. I don't mind. All I wanted was to get you started quickly, and help you avoid some of the pain I went through when setting up my projects. Feel free to `ignite spork` and follow your :nose:.

### TODO
- [] Add testing with jest. Coming Soon!. :)
- [x] Write some integration tests. No, really. :)
- [x] Add a proper boilerplate for ~~both~~ web ~~and electron~~ projects
- [] Uninstall. Although, I am not sure why you'd want to leave.
- [x] Live long and prosper. 🖖
