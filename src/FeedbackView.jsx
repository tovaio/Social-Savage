import Carousel from 'react-bootstrap/Carousel'
import request from 'browser-request';
import url from 'url';

class FeedbackView extends React.Component {

    state = {
        loading: true,
        feedback: []
    }

    feedbackInfo = {
        posts: [
            {
                pictures: ["https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                    "https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg", "https://www.w3schools.com/w3css/img_lights.jpg",
                    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"],
                suggested_captions: ["cap1", "cap2", "cap3"],
                tags: ["t1", "t2", "t3"],
                goalPics: 2,
                ratings: [
                    {
                        topNPics: [0, 1],
                        topCap: 0,
                        caption_suggestions: ["goodcap1", "goodcap2"]
                    },
                    {
                        topNPics: [1, 2],
                        topCap: 0,
                        caption_suggestions: ["goodcap3", "goodcap4"]
                    }
                ]
            },
            {
                pictures: ["https://www.w3schools.com/w3css/img_lights.jpg",
                    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                    "https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg"],
                suggested_captions: ["cap1", "cap2", "cap3"],
                tags: ["t1", "t2", "t3"],
                goalPics: 2,
                ratings: [
                    {
                        topNPics: [0, 1],
                        topCap: 0,
                        caption_suggestions: ["goodcap1", "goodcap2"]
                    },
                    {
                        topNPics: [1, 2],
                        topCap: 0,
                        caption_suggestions: ["goodcap3", "goodcap4"]
                    }
                ]
            }
        ]

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
                <img src={pic} height={500} width={1200}/>
            </Carousel.Item>
        );
        return (<Carousel>{listItems}</Carousel>);
    };

    renderPosts = (posts) => {
        const listItems = posts.map((post, index) =>
            <div key={index} style={{padding: "20px 20px 20px 20px"}}>
                {this.renderImages(post.images)}
                <p># of Photos You Want to Post: not yet implemented</p>
                <p> Your Potential Captions</p>
                {this.renderCaptions(post.captions)}
                <p>Your Tags: not yet implemented</p>
            </div>
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
                <h1>Your Feedback</h1>
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