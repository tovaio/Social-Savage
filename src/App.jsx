import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import LoginView from './LoginView';
import NavbarLogin from './NavbarLogin';
import NavbarTabs from './NavbarTabs';

import UploadView from './UploadView';
import FeedbackView from './FeedbackView';
import RateView from './RateView';

require('bootstrap/dist/css/bootstrap.min.css');
require('./App.css');

class App extends React.Component {

    state = {
        loginInfo: {
            loggedIn: false
        },
        currentView: 0
    }

    handleUpdateLoginInfo = (loginInfo) => {
        this.setState({
            loginInfo: loginInfo
        });
    }

    handleUpdateCurrentView = (currentView) => {
        this.setState({
            currentView: currentView
        });
    }

    render() {
        return (
            <div style={{
                height: '100%',
                minHeight: '100vh',
                padding: '30px',
                background: '#ffffff',
                backgroundImage: `url(https://demos.creative-tim.com/argon-design-system-pro-angular/assets/img/ill/404.svg)`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}>
                <Container fluid>
                    <Row className='justify-content-center'>
                        <Col xs={12} lg={8}>
                            <Container fluid>
                                {
                                    this.state.loginInfo.loggedIn && 
                                    <Navbar bg="light" variant="light" className='mb-3 rounded shadow' >
                                        <Navbar.Brand>SocialSavage</Navbar.Brand>
                                        <Navbar.Toggle />
                                        <NavbarTabs loginInfo={this.state.loginInfo} onUpdateCurrentView={this.handleUpdateCurrentView} />
                                        <NavbarLogin loginInfo={this.state.loginInfo} onUpdateLoginInfo={this.handleUpdateLoginInfo} />
                                    </Navbar>
                                }
                                
                                {
                                    !(this.state.loginInfo.loggedIn) ?
                                        <LoginView onUpdateLoginInfo={this.handleUpdateLoginInfo} />
                                        : (this.state.currentView == 0) ?
                                            <UploadView loginInfo={this.state.loginInfo} />
                                            : (this.state.currentView == 1) ?
                                                <FeedbackView loginInfo={this.state.loginInfo} />
                                                : (this.state.currentView == 2) ?
                                                    <RateView loginInfo={this.state.loginInfo} />
                                                    : null
                                }
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}

export default App;