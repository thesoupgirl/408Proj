import React from 'react'
import { Button, Jumbotron } from 'react-bootstrap'

class LoginPage extends React.Component {
  render() {
    const { authUser } = this.props
    return (
      <div className='container'>
        <Jumbotron>
          <p>Please sign in with your Google Account to use Epstein.</p>
          <Button bsStyle='primary' className='signinbtn' href='/login/google'>Sign in</Button>
        </Jumbotron>
      </div>
    )
  }
}

export default LoginPage
