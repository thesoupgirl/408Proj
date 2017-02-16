import React from 'react'
import { render } from 'react-dom'
import ajax from 'jquery'
import { isEmpty } from 'lodash'

import 'style/bootswatch'

import LoginPage from './LoginPage'
import MainLayout from './MainLayout'
import UserPage from './UserPage'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeView: LoginPage,
      authorized: false,
      user: {}
    }
  }

  componentDidMount() {
    this.getAuthorized()
  }

  componentDidUpdate() {
    const { authorized } = this.state

    if (!this.isActiveView(UserPage) && authorized) {
      this.setActiveView(UserPage)
    }

    if (!this.isActiveView(LoginPage) && !authorized) {
      this.setActiveView(LoginPage)
    }
  }

  getAuthorized() {
    ajax({
      url: '/me',
      method: 'GET',
      success: (user, status, xhr) => {
        const ct = xhr.getResponseHeader('content-type') || '';

        if (ct.indexOf('html') > -1) {
          this.setState({ user: {}, authorized: false })
        } else if (ct.indexOf('json') > -1) {
          this.setState({ user, authorized: true })
        }
      },
      error: response => {
        console.log(error)
      }
    })
  }

  setActiveView(activeView) {
    this.setState({ activeView })
  }

  isActiveView(view) {
    return view === this.state.activeView
  }

  render() {
    return (
      <MainLayout
        activeView={this.state.activeView}
        authUser={() => this.authUser()}
        setActiveView={activeView => this.setActiveView(activeView)}
      />
    )
  }
}

render(<App/>, document.getElementById('app'))
