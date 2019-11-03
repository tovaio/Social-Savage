import request from 'browser-request';
import url from 'url';

import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import ImagePagination from './ImagePagination';

class FeedbackView extends React.Component {

    state = {
        loading: true,
        feedback: []
    }

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

    renderPosts = (posts) => {
        const listItems = posts.map((post, index) =>
            <Jumbotron fluid>
                {this.renderImages(post.images)}
                <p># of Photos You Want to Post: not yet implemented</p>
                <p> Your Potential Captions</p>
                {this.renderCaptions(post.captions)}
                <p>Your Tags: not yet implemented</p>
            </Jumbotron>
        );
        return listItems;
    }

    componentDidMount() {
        this.setState({
            loading: true,
            feedback: []
        });

        request.get({
            uri: url.resolve(location.href, '/feedback')
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                body = JSON.parse(body);
                this.setState({
                    loading: false,
                    feedback: body
                });
            }
        });
    }

    render() {
        const posts = this.state.feedback.map((post, i) => {
            if (post.ratings.length > 0) {
                let picSum = Array(post.images.length).fill(0);
                let capSum = Array(post.captions.length).fill(0);

                post.ratings.forEach((rating) => {
                    picSum[rating.topPic] += 1;
                    capSum[rating.topCaption] += 1;
                });

                const picPerc = picSum.map((sum) => Math.floor(sum / post.ratings.length * 100.0).toString() + '%');
                const capPerc = capSum.map((sum) => Math.floor(sum / post.ratings.length * 100.0).toString() + '%');
                
                const captionRatings = post.captions.map((caption, i) => 
                    <li key={i}>
                        "{caption}" - <b>{capPerc[i]}</b>
                    </li>
                );

                return (
                    <Jumbotron fluid key={i} className='p-3'>
                        <ImagePagination images={post.images} labels={picPerc}/>
                        <h5 className='mt-3 mb-3'>{post.ratings.length} rating{(post.ratings.length > 1) ? 's' : ''} in!</h5>
                        <h6>Captions:</h6>
                        <ul className='mb-0'>
                            {captionRatings}
                        </ul>
                    </Jumbotron>
                )
            } else {
                const captions = post.captions.map((caption, i) => 
                    <li key={i}>
                        "{caption}"
                    </li>
                );

                return (
                    <Jumbotron fluid key={i} className='p-3'>
                        <ImagePagination images={post.images}/>
                        <h5 className='mt-3 mb-3'>No ratings yet!</h5>
                        <h6>Captions:</h6>
                        <ul className='mb-0'>
                            {captions}
                        </ul>
                    </Jumbotron>
                )
            }
        });

        return (
            <Container className='bg-light rounded p-3 shadow' fluid>
                <h4 className='mb-3'>View feedback on your posts from people around the world!</h4>

                {posts}
            </Container>
        );
    }

}

export default FeedbackView;