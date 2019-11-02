import Nav from 'react-bootstrap/Nav';

class NavbarTabs extends React.Component {

    handleSelect = (eventKey) => {
        this.props.onUpdateCurrentView(eventKey);
    }

    render() {
        if (this.props.loginInfo.loggedIn) {
            return (
                <Nav className="mr-auto">
                    <Nav.Link onSelect={this.handleSelect} eventKey={0}>Upload</Nav.Link>
                    <Nav.Link onSelect={this.handleSelect} eventKey={1}>Feedback</Nav.Link>
                    <Nav.Link onSelect={this.handleSelect} eventKey={2}>Rate</Nav.Link>
                </Nav>
            );
        } else {
            return null;
        }
    }
    
}

export default NavbarTabs;