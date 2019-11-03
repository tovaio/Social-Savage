import FormData from 'form-data'

import Container from 'react-bootstrap/Container';

class UploadView extends React.Component {

    handleSubmit = (e) => {
        $('#errorText').empty();
        e.preventDefault();
        const files = $('#images').prop('files');
        const data = new FormData();
        let invalid = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size >= 1024 * 1024 * 10) {
                invalid.push(file.name);
            } else {
                data.append(`image${i}`, files[i]);
            }
        }
        if (invalid.length == 0) {
            fetch('/upload', {
                method: 'POST',
                body: data
            });
        } else {
            $('#errorText').text(`${invalid.join(', ')} image${(invalid.length == 1) ? ' is ' : 's are '} too large. Max file size is 10 MB.`);
        }
    }

    render() {
        return (
            <Container fluid={true}>
                <form onSubmit={this.handleSubmit}>
                    <input type="file" name="images" id="images" accept="image/png, image/jpeg" multiple />
                    <input type="submit" value="Upload!" name="submit" />
                </form>
                <p id="errorText"></p>
            </Container>
        );
    }

}

export default UploadView;