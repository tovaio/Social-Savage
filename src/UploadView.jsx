import FormData from 'form-data'

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';

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
            <InputGroup className='mb-3'>
                {
                    (this.props.ind > 0)
                        ? <InputGroup.Prepend>
                            <Button variant='outline-secondary' onClick={this.handleRemove}>Remove</Button>
                        </InputGroup.Prepend>
                        : null
                }
                <FormControl type='text' placeholder='Type a caption here!' value={this.props.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} autoFocus={this.props.ind != 0}/>
                {
                    (this.props.last && this.props.ind < MAX_CAPTIONS - 1)
                        ? <InputGroup.Append>
                            <Button variant='outline-secondary' onClick={this.props.onAdd}>Add</Button>
                        </InputGroup.Append>
                        : null
                }
            </InputGroup>
        );
    }
}

function ImageDisplay(props) {
    const items = props.files.map((file, index) => 
        <Image src={window.URL.createObjectURL(file)} className='h-100 mr-2' style={{objectFit: 'contain'}} rounded/>
    );
    if (items.length > 0) {
        return (
            <div className='mb-3'>
                <label>Image Preview</label>
                <div className='d-inline-flex' style={{height: '35vh', width: '100%', overflowX: 'scroll'}}>
                    {items}
                </div>
            </div>
        )
    } else return null;
}

class UploadView extends React.Component {

    state = {
        captions: [''],
        error: '',
        files: []
    }

    handleAdd = () => {
        this.setState((prevState, props) => {
            const newCaptions = prevState.captions.slice(0);
            newCaptions.push('');
            return {
                captions: newCaptions
            };
        });
    }

    handleRemove = (ind) => {
        this.setState((prevState, props) => {
            const newCaptions = prevState.captions.slice(0);
            newCaptions.splice(ind, 1);
            return {
                captions: newCaptions
            };
        });
    }
    
    handleChange = (ind, value) => {
        this.setState((prevState, props) => {
            const newCaptions = prevState.captions.slice(0);
            newCaptions[ind] = value;
            return {
                captions: newCaptions
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
            error: (invalid.length > 0) ? `${invalid.join(', ')} image${(invalid.length == 1) ? ' is ' : 's are '} too large. Max file size is 10 MB.` : ''
        });
    }

    handleSubmit = (e) => {
        this.setState({error: ''});

        if (this.state.files.length == 0) {
            this.setState({error: 'No valid files selected!'});
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
            this.setState({error: 'No valid captions entered!'});
            return;
        }

        data.append('captions', JSON.stringify(captions));
        
        fetch('/upload', {
            method: 'POST',
            body: data
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
            <Container>
                <label>Upload Images</label>
                <InputGroup className='mb-3'>
                    <FormControl type='file' accept="image/png, image/jpeg" multiple onChange={this.handleImageChange}/>
                </InputGroup>

                <ImageDisplay files={this.state.files}/>

                <label>Enter Potential Captions:</label>
                {captionInputs}

                <InputGroup className='mb-3'>
                    <Button onClick={this.handleSubmit}>Upload</Button>
                </InputGroup>

                <p className='text-muted'>
                    {this.state.error}
                </p>
            </Container>
        );
    }

}

export default UploadView;