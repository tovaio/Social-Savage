import request from 'browser-request';
import url from 'url';
import Button from 'react-bootstrap/Button'

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
            <div style={{
                height: "90vh",
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <h1 style={{
                    fontSize: "3.3rem",
                    fontWeight: "600",
                    fontFamily: `"Open Sans",sans-serif`,
                    marginBottom: "30px"
                }}>Join ImageCritique Today!</h1>
                
                <GoogleLogin 
                    render={renderProps => (
                        <Button variant="primary"
                            onClick={renderProps.onClick}
                            style={{
                                textTransform: "capitalize",
                                letterSpacing: ".025em",
                                fontSize: ".875rem",
                                color: "#fff",
                                backgroundColor: "#5e72e4",
                                borderColor: "#5e72e4",
                                boxShadow: "0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)",
                                fontWeight: "600",
                                fontFamily: `"Open Sans",sans-serif`,
                                border: "1px solid transparent",
                                padding: ".625rem 1.25rem",
                                borderRadius: ".25rem"

                            }}>LOGIN WITH US</Button>
                        
            )}
                    clientId = {CLIENT_ID}
                    buttonText = "Join"
                    onSuccess = {this.handleSuccess}
                    onFailure = {this.handleFailure}
                    cookiePolicy = {'single_host_origin'}
                />
            </div>
        )
    }
}

export default LoginView;