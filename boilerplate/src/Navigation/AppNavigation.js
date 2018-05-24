import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Import Screens for the Router
// prettier-ignore
import {
  RootScreen
} from '../Containers'

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <div>
          <Route exact path='/' component={RootScreen} />
        </div>
      </Router>
    )
  }
}
export default NavigationRouter
