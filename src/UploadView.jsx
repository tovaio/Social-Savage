import FormData from 'form-data'

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Alert from 'react-bootstrap/Alert';

import ImagePagination from './ImagePagination';

const MAX_CAPTIONS = 5;

class CaptionInput extends React.Component {
    handleRemove = () => {
        this.props.onRemove(this.props.ind);
    }

    handleChange = (e) => {
        this.props.onChange(this.props.ind, e.target.value);
    }

    handleKeyPress = (e) => {
        if (this.props.last && this.props.ind < MAX_CAPTIONS - 1 && e.charCode == 13) {
            this.props.onAdd();
        }
    }

    render() {
        return (
            <InputGroup className={this.props.last ? 'mb-0' : 'mb-3'}>
                {
                    ((this.props.ind > 0) || (this.props.ind == 0 && !(this.props.last)))
                        ? <InputGroup.Prepend>
                            <Button variant='outline-danger' onClick={this.handleRemove}>Remove</Button>
                        </InputGroup.Prepend>
                        : null
                }
                <FormControl type='text' placeholder='Type a caption here!' value={this.props.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} autoFocus={this.props.ind != 0}/>
                {
                    (this.props.last && this.props.ind < MAX_CAPTIONS - 1)
                        ? <InputGroup.Append>
                            <Button variant='outline-primary' onClick={this.props.onAdd}>Add</Button>
                        </InputGroup.Append>
                        : null
                }
            </InputGroup>
        );
    }
}

function ImageDisplay(props) {
    const images = props.files.map((file, index) => window.URL.createObjectURL(file));
    if (images.length > 0) {
        return (
            <>
                <h5 className='mt-3'>Image Preview:</h5>
                <ImagePagination images={images} />
            </>
        );
    } else return null;
}

class UploadView extends React.Component {

    state = {
        captions: [''],
        error: '',
        files: [],
        justUploaded: false
    }

    handleAdd = () => {
        this.setState((prevState, props) => {
            const newCaptions = prevState.captions.slice(0);
            newCaptions.push('');
            return {
                captions: newCaptions,
                justUploaded: false
            };
        });
    }

    handleRemove = (ind) => {
        this.setState((prevState, props) => {
            const newCaptions = prevState.captions.slice(0);
            newCaptions.splice(ind, 1);
            return {
                captions: newCaptions,
                justUploaded: false
            };
        });
    }
    
    handleChange = (ind, value) => {
        this.setState((prevState, props) => {
            const newCaptions = prevState.captions.slice(0);
            newCaptions[ind] = value;
            return {
                captions: newCaptions,
                justUploaded: false
            };
        });
    }

    handleImageChange = (e) => {
        const files = e.target.files;

        let invalid = []
        let newFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size >= 1024 * 1024 * 10) {
                invalid.push(file.name);
            } else {
                newFiles.push(file);
            }
        }

        this.setState({
            files: newFiles,
            error: (invalid.length > 0) ? `${invalid.join(', ')} image${(invalid.length == 1) ? ' is ' : 's are '} too large. Max file size is 10 MB.` : '',
            justUploaded: false
        });

        e.target.value = '';
    }

    handleSubmit = (e) => {
        this.setState({error: ''});

        if (this.state.files.length == 0) {
            this.setState({error: 'No valid files selected!', justUploaded: false});
            return;
        }
        
        const data = new FormData();
        this.state.files.forEach((file, i) => {
            data.append(`image${i}`, file);
        });

        const captions = [];
        this.state.captions.forEach((caption) => {
            caption = caption.replace(/\s+/g, ' ').trim();
            if (caption != '') {
                captions.push(caption);
            }
        });

        if (captions.length == 0) {
            this.setState({error: 'No valid captions entered!', justUploaded: false});
            return;
        }

        if (this.state.files.length == 1 && captions.length == 1) {
            this.setState({error: 'Need at least 2 of either images or captions!', justUploaded: false});
            return;
        }

        data.append('captions', JSON.stringify(captions));
        
        fetch('/upload', {
            method: 'POST',
            body: data
        });

        this.setState({
            captions: [''],
            error: '',
            files: [],
            justUploaded: true
        });
    }

    render() {
        const captionInputs = this.state.captions.map((caption, index) => 
            <CaptionInput
                key={index}
                ind={index}
                last={(index == this.state.captions.length-1)}
                value={caption}
                onAdd={this.handleAdd}
                onRemove={this.handleRemove}
                onChange={this.handleChange}
            />
        );

        return (
            <Container className='bg-light rounded p-3 shadow' fluid>
                <h4 className='mb-3'>See what the world thinks about your social media ideas!</h4>

                {
                    this.state.justUploaded
                        ? <Alert variant='success'>Uploaded!</Alert>
                        : null
                }

                <Jumbotron className='p-3'>
                    <h5>Upload Images</h5>
                    <InputGroup>
                        <FormControl type='file' accept="image/png, image/jpeg" multiple onChange={this.handleImageChange}/>
                    </InputGroup>

                    <ImageDisplay files={this.state.files}/>
                </Jumbotron>

                <Jumbotron className='p-3'>
                    <h5>Enter Potential Captions:</h5>
                    {captionInputs}
                </Jumbotron>

                <InputGroup className='mb-0'>
                    <Button onClick={this.handleSubmit}>Upload</Button>
                </InputGroup>

                {
                    (this.state.error != '')
                        ? <p className='text-muted mt-3 mb-0'>
                            {this.state.error}
                        </p>
                        : null
                }
            </Container>
        );
    }

}

export default UploadView;