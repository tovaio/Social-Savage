import React from 'react';
import { StyledDropZone } from 'react-drop-zone';
import GoogleLogin from 'react-google-login';
import request from 'browser-request';
import url from 'url';
import 'react-drop-zone/dist/styles.css';
require('./App.css');

function handleDrop(file, text) {
    console.log(file);
}

function handleSuccess(response) {
    const tokenId = response.Zi.id_token;
    console.log(tokenId);
    request.post({
        uri: url.resolve(location.href, '/googleAuth'),
        json: {
            tokenId: tokenId
        }
    }, (err, res, body) => {
        if (err) {
            console.error(err);
        } else {
            console.log(body);
        }
    });
}

function handleFailure(response) {
    console.log(response.error);
}

function App(props) {
    return (
        <>
            <h1 id="title">Initial test!</h1>
            <StyledDropZone onDrop={handleDrop}></StyledDropZone>
            <GoogleLogin 
                clientId = "883452357556-rsf99lsl7dl28f092b86q5j5aqk989bf.apps.googleusercontent.com"
                buttonText = "Login"
                onSuccess = {handleSuccess}
                onFailure = {handleFailure}
                cookiePolicy = {'single_host_origin'}
            />
        </>
    );
}

export default App;