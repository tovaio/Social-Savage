import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import request from 'browser-request';
import url from 'url';

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
            <Container className='bg-light rounded p-3 shadow' fluid key={index} style={{marginBottom:"30px", width:"75%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                {this.renderImages(post.images)}
                <p># of Photos You Want to Post: not yet implemented</p>
                <p> Your Potential Captions</p>
                {this.renderCaptions(post.captions)}
                <p>Your Tags: not yet implemented</p>
            </Container>
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
        return (
            <div>
                <h1 style={{display:"flex", flexDirection: "column", alignItems:"center"}}>Your Feedback</h1>
                {
                    (this.state.feedback.length > 0)
                        ? this.renderPosts(this.state.feedback)
                        : (this.state.loading)
                            ? <p>Loading...</p>
                            : <p>You have made no posts yet. Make one now!</p>
                }
            </div>
        );
    }

}

export default FeedbackView;