import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Image from 'react-bootstrap/Image';

class ImagePagination extends React.Component {
    state = {
        page: 0
    }

    handleClick = (ind) => {
        this.setState({
            page: ind
        });
        if (this.props.onChange) {
            this.props.onChange(ind);
        }
    }

    render() {
        const paginationItems = this.props.images.map((image, i) => 
            <Button
                key={i}
                variant={(i == this.state.page) ? 'primary' : 'secondary'}
                onClick={() => {this.handleClick(i)}}
            >
                <Image src={image} rounded className='mr-3' style={{height: '64px', width: '64px', objectFit: 'cover'}}/>
                {(this.props.labels) ? this.props.labels[i] : null}
            </Button>
        );

        return (
            <div className='d-flex flex-column shadow-sm'>
                <Image src={this.props.images[this.state.page]} className='bg-dark rounded-top' style={{objectFit: 'contain', height: '300px'}}/>
                
                <ButtonGroup className='rounded-bottom'>
                    {paginationItems}
                </ButtonGroup>
            </div>
        );
    }
}

export default ImagePagination;