import request from 'browser-request';
import url from 'url';

import Navbar from 'react-bootstrap/Navbar'
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const CLIENT_ID = "883452357556-rsf99lsl7dl28f092b86q5j5aqk989bf.apps.googleusercontent.com";

class NavbarLogin extends React.Component {

    handleLogoutSuccess = () => {
        request.post({
            uri: url.resolve(location.href, '/logout')
        }, (err, res, body) => {
            if (err) {
                console.error(err);
            } else {
                body = JSON.parse(body);
                if ('success' in body && body.success) {
                    console.log('Logged out!');
                    this.props.onUpdateLoginInfo({loggedIn: false});
                }
            }
        });
    }
    
    handleFailure = (response) => {
        console.log(response.error);
    }

    render() {
        return (
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    {
                        this.props.loginInfo.loggedIn ? 
                            `Hello, ${this.props.loginInfo.userInfo.givenName}!` :
                            'Get started now!'
                    }
                </Navbar.Text>
                {
                    this.props.loginInfo.loggedIn ?
                        <GoogleLogout 
                            className='ml-3'
                            clientId = {CLIENT_ID}
                            buttonText = "Logout"
                            onLogoutSuccess = {this.handleLogoutSuccess}
                            onFailure = {this.handleFailure}
                        /> : null
                }
            </Navbar.Collapse>
        )
    }

}

export default NavbarLogin;

