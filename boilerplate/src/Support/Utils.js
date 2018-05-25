import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider, intlShape } from 'react-intl'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

export const createComponentWithIntl = (children, props = { locale: 'en' }) => {
  return renderer.create(<IntlProvider {...props}>{children}</IntlProvider>)
}

/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
const messages = require('../Translations/en') // en.json

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en', messages }, {})
const { intl } = intlProvider.getChildContext()

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp (node) {
  return React.cloneElement(node, { intl })
}

export function shallowWithIntl (node, { context } = {}) {
  return shallow(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl })
  })
}

export function mountWithIntl (node, { context, childContextTypes } = {}) {
  return mount(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes)
  })
}
