import React from 'react';
import Iframe from 'react-iframe'

const Games = React.createClass({
    render() {

    return (
      <div className='container'>
        <Iframe url="https://epsteingames.herokuapp.com/"
            position="absolute"
            width="100%"
            id="myId"
            className="myClassname"
            height="200%"
            styles={{height: "800px"}}
            allowFullScreen/>
      </div>
    )
  }
});
export default Games;