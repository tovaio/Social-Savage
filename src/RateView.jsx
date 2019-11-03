import request from 'browser-request';
import url from 'url';

import InfiniteScroll from 'react-infinite-scroll-component';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ImagePagination from './ImagePagination';

class VotingBooth extends React.Component {
    state = {
        topPic: 0,
        topCaption: 0
    }

    handleRemove = () => {
        this.props.onRemove(this.props.ind);
    }

    handlePicChange = (ind) => {
        this.setState({
            topPic: ind
        });
    }

    handleCaptionChange(ind, e) {
        if (e.target.value == 'on') {
            this.setState({
                topCaption: ind
            });
        }
    }

    handleSubmit = () => {
        request.get({
            uri: url.resolve(location.href, `/vote?postId=${this.props.post._id}&topPic=${this.state.topPic}&topCaption=${this.state.topCaption}`)
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                console.log(body);
            }
        });
        this.handleRemove();
    }

    render() {
        return (
            <Jumbotron fluid className='p-3'>
                <ImagePagination images={this.props.post.images} onChange={this.handlePicChange} />
                <h6 className='mt-3'>Captions:</h6>
                <Form.Group className='mb-3'>
                    {
                        this.props.post.captions.map((caption, j) =>
                            <Form.Check name={this.props.ind.toString()} key={j} type='radio' label={`"${caption}"`} defaultChecked={j == 0} onClick={this.handleCaptionChange.bind(this, j)}/>
                        )
                    }
                </Form.Group>
                <Button onClick={this.handleSubmit}>Vote</Button>
            </Jumbotron>
        );
    }
}

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
        this.fetchMoreData(2);
    }

    fetchMoreData = (limit = 1) => {
        // a fake async api call like which sends
        // Let's fetch 10 in one time

        request.get({
            uri: url.resolve(location.href, `/rate?offset=${this.state.rate_list.length}&limit=${limit}`)
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                body = JSON.parse(body);
                this.setState({
                    loading: false,
                    rate_list: [...this.state.rate_list, ...body]
                });
            }
        });
    };

    handleRemove = (ind) => {
        this.setState((prevState) => {
            let newList = prevState.rate_list.slice(0);
            newList.splice(ind, 1);
            return {
                loading: true,
                rate_list: newList
            }
        });
        this.fetchMoreData();
    }

    render() {
        return (
            <Container className='bg-light rounded p-3 shadow' fluid>
                <h4 className='mb-3'>Help out other users by rating their posts!</h4>
                <InfiniteScroll
                    dataLength={this.state.rate_list.length}
                    next={this.fetchMoreData}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                >
                    {this.state.rate_list.map((post, i) => 
                        <VotingBooth key={i} ind={i} onRemove={this.handleRemove} post={post}/>
                    )}
                </InfiniteScroll>
            </Container>
        );
    }

}

export default RateView;