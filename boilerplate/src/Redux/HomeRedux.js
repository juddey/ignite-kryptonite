import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  homeData: ['data'],
  homeRequest: ['data'],
  homeSuccess: ['payload'],
  homeFailure: null
})

export const HomeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: { current: 0 },
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

// Just storing some data, thanks.
export const data = (state, { data }) => state.merge({ data }, { deep: true })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.HOME_DATA]: data,
  [Types.HOME_REQUEST]: request,
  [Types.HOME_SUCCESS]: success,
  [Types.HOME_FAILURE]: failure
})
