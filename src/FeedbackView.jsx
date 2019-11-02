import Carousel from 'react-bootstrap/Carousel'

class FeedbackView extends React.Component {

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
                <img src= {pic} height={500} width={1200}/>
            </Carousel.Item>
        );
        return (<Carousel>{listItems}</Carousel>);
    };
    renderPosts = (posts) => {
        const listItems = posts.map((post, index) =>
            (<div style={{padding: "20px 20px 20px 20px"}}>
                {this.renderImages(post.pictures)}
                <h2># of Photos You Want to Post: {post.goalPics}</h2>
                <h2> Your Potential Captions</h2>
                {this.renderCaptions(post.suggested_captions)}
                <h2>Your Tags</h2>
                {this.renderCaptions(post.tags)}
            </div>)
        );
        return listItems;
    }

    render() {
        return (
            <div>
                <h1>Your Feedback</h1>
                <ul>
                    {this.renderPosts(this.feedbackInfo.posts)}
                </ul>
            </div>
        );
    }

}

export default FeedbackView;