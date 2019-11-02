import FormData from 'form-data'

import Container from 'react-bootstrap/Container';

class UploadView extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        const files = $('#images').prop('files');
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append(`image${i}`, files[i]);
        }
        console.log(data);
        fetch('/upload', {
            method: 'POST',
            body: data
        });
    }

    render() {
        return (
            <Container fluid={true}>
                <form onSubmit={this.handleSubmit}>
                    <input type="file" name="images" id="images" accept="image/png, image/jpeg" multiple />
                    <input type="submit" value="Upload!" name="submit" />
                </form>
            </Container>
        );
    }

}

export default UploadView;