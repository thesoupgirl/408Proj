import htmlContent from '../GameMenu/html/game_menu.html';
import React from 'react';

const Games = React.createClass({
    render() {
        return (
            <div dangerouslySetInnerHTML={ {__html: htmlContent} } />
        );
    }
});
export default Games;