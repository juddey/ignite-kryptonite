import ReduxPersist from '../Config/ReduxPersist'
import LocalForage from 'localforage'
import { persistStore } from 'redux-persist'
import StartupActions from '../Redux/StartupRedux'
import DebugConfig from '../Config/DebugConfig'

const updateReducers = store => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig
  const startup = () => store.dispatch(StartupActions.startup())

  // Check to ensure latest reducer version
  LocalForage.getItem('reducerVersion')
    .then(localVersion => {
      if (localVersion !== reducerVersion) {
        if (DebugConfig.useReactotron) {
          console.tron.display({
            name: 'PURGE',
            value: {
              'Old Version:': localVersion,
              'New Version:': reducerVersion
            },
            preview: 'Reducer Version Change Detected',
            important: true
          })
        } else {
          // console.log(
          //  'Reducer Version Change from: ' +
          //    localVersion +
          //    ' to: ' +
          //    reducerVersion
          // )
        }
        // Purge store
        persistStore(store, config, startup).purge()
        LocalForage.setItem('reducerVersion', reducerVersion)
      } else {
        persistStore(store, config, startup)
      }
    })
    .catch(() => {
      persistStore(store, config, startup)
      LocalForage.setItem('reducerVersion', reducerVersion)
    })
}

export default { updateReducers }
