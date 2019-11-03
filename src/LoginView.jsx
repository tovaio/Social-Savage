import request from 'browser-request';
import url from 'url';

import Jumbotron from 'react-bootstrap/Jumbotron';
import { GoogleLogin } from 'react-google-login';

const CLIENT_ID = "883452357556-rsf99lsl7dl28f092b86q5j5aqk989bf.apps.googleusercontent.com";

class LoginView extends React.Component {
    handleSuccess = (response) => {
        const tokenId = response.Zi.id_token;
        request.post({
            uri: url.resolve(location.href, '/login'),
            json: {
                tokenId: tokenId
            }
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                if (!('loginInfo' in body)) return;
                console.log(body);
                this.props.onUpdateLoginInfo(body.loginInfo);
            }
        });
    }
    
    handleFailure = (response) => {
        console.log(response.error);
    }

    componentDidMount() {
        request.get({
            uri: url.resolve(location.href, '/isLoggedIn')
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                body = JSON.parse(body);
                this.props.onUpdateLoginInfo(body.loginInfo);
            }
        });
    }

    render() {
        return (
            <Jumbotron className="justify-content-center">
                Join ImageCritique today! Sign in with your Google Account:
                <GoogleLogin 
                    clientId = {CLIENT_ID}
                    buttonText = "Login"
                    onSuccess = {this.handleSuccess}
                    onFailure = {this.handleFailure}
                    cookiePolicy = {'single_host_origin'}
                />
            </Jumbotron>
        )
    }
}

export default LoginView;