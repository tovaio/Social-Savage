import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import $ from 'jquery';

$(() => {
    $('body').append($('<div></div>').attr('id', 'root'));

    function render() {
        ReactDOM.render(
            <App />,
            document.getElementById('root')
        );
    }

    render();

    if (module.hot) {
        module.hot.accept('./App', render);
    }
});
