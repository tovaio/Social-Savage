import InfiniteScroll from 'react-infinite-scroll-component';
import request from 'browser-request';
import url from 'url';


const style = {
    // height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
};

class RateView extends React.Component {
    state = {
        items: Array.from({ length: 20 }),
        loading: false,
        rate_list: []
    };

    componentDidMount() {
        this.setState({
            loading: true,
            rate_list: []
        });
        this.fetchMoreData();
    }

    fetchMoreData = () => {
        // a fake async api call like which sends
        request.get({
            uri: url.resolve(location.href, '/rate')
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                body = JSON.parse(body);
                console.log(body)
                this.setState({
                    loading: false,
                    rate_list: body
                });
            }
        });
        console.log("fetch more data")
    };
    render() {
        return (
            <div>
                <h1>Help out other users by rating their posts!</h1>
                <hr />
                <InfiniteScroll
                    dataLength={this.state.items.length}
                    next={this.fetchMoreData}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.rate_list.map((item, index) => (
                        <div style={style} key={index}>
                            {JSON.stringify(item)}
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        );
    }

}

export default RateView;