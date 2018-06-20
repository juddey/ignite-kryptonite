// In this file, replace console.log with an alert function of your choosing.

import { call, select } from 'redux-saga/effects'
import { propOr, cond, equals, always, isNil } from 'ramda'

const IntlMessageFormat = require('intl-messageformat')
const sagaMessages = {
  en: {
    noResults: 'Sorry, there were no results found for that search.',
    error: 'Sorry, something went wrong.',
    saved: 'Saved Successfully.',
    signedOut: 'Signed Out Successfully.'
  }
}

export const theUserPrefs = state => 'en' // state.user.data.preferences.language
export const langWithDefault = propOr('en', 'language')

export const val = (type, userPrefs, duration) => {
  var msg = cond([
    [
      equals('noResults'),
      always(() =>
        console.log(
          getMessage(langWithDefault(userPrefs), 'noResults'),
          duration
        )
      )
    ],
    [
      equals('signedOut'),
      always(() =>
        console.log(
          getMessage(langWithDefault(userPrefs), 'signedOut'),
          duration
        )
      )
    ],
    [
      equals('saved'),
      always(() =>
        console.log(getMessage(langWithDefault(userPrefs), 'saved'), duration)
      )
    ],
    [
      equals('error'),
      always(() =>
        console.log(getMessage(langWithDefault(userPrefs), 'error'), duration)
      )
    ]
  ])
  return msg(type)
}

function getMessage (langCode, name) {
  let translatedMessage = new IntlMessageFormat(
    sagaMessages[`${langCode}`][`${name}`]
  )
  return translatedMessage.format()
}

function * showSagaMessage (msgType, durationIn) {
  const userPrefs = yield select(theUserPrefs)
  let duration
  isNil(durationIn) ? (duration = 2) : (duration = durationIn)
  yield call(val(msgType, userPrefs, duration))
}

export { getMessage, showSagaMessage }
