import App from './App';

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
