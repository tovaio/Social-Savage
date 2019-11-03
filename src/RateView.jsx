import InfiniteScroll from 'react-infinite-scroll-component';
import request from 'browser-request';
import url from 'url';
import Carousel from "react-bootstrap/Carousel";
import Pagination from "react-bootstrap/Pagination";


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
        rate_list: [],
        offset: 0,
    };

    renderCaptions = (captions) => {
        const listItems = captions.map((caption, index) =>
            <li key={index}>
                <p>{caption}</p>
            </li>
        );
        return (<ul>{listItems}</ul>);
    };
    renderImages = (pics) => {
        const listItems = pics.map((pic, index) =>
            <Carousel.Item key={index}>
                <div style={{height: "300px", width: "500px"}}>
                    <img  src={pic} style={{maxWidth: "100%"}}/>
                </div>
            </Carousel.Item>
        );
        return (<Carousel style={{height: "300px", width: "500px"}}>{listItems}</Carousel>);
    };
    getItems(numImages) {
        let items = [];
        for (let number = 1; number <= numImages; number++) {
            items.push(
                <Pagination.Item key={number}>
                    {number}
                </Pagination.Item>,
            );
        }
        return items
    }

    componentDidMount() {
        this.setState({
            loading: true,
            rate_list: [],
            offset: 0,
        });
        this.fetchMoreData();
    }

    fetchMoreData = () => {
        // a fake async api call like which sends
        // Let's fetch 10 in one time
        const limit = 10;

        request.get({
            uri: url.resolve(location.href, `/rate?offset=${this.state.offset}&limit=${limit}`)
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                body = JSON.parse(body);
                console.log(body)
                this.setState({
                    loading: false,
                    rate_list: [...this.state.rate_list, ...body],
                    offset: this.state.offset + limit,
                });
            }
        });
        console.log(`/rate?offset=${this.state.offset}&limit=${limit}`)
    };
    render() {
        return (
            <div>
                <h1>Help out other users by rating their posts!</h1>
                <hr />
                <InfiniteScroll
                    dataLength={this.state.rate_list.length}
                    next={this.fetchMoreData}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.rate_list.map((item, index) => (
                        <div style={{display:"flex", flexDirection:"row"}}>
                            <div style={style} key={index}>
                                {this.renderImages(item.images)}
                                {this.renderCaptions(item.captions)}
                            </div>
                            <div>
                                <Pagination size="lg">{this.getItems(item.images.length)}</Pagination>
                                <br />
                            </div>
                        </div>

                    ))}
                </InfiniteScroll>
            </div>
        );
    }

}

export default RateView;