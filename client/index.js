import "./index.scss";

const server = "http://localhost:3042";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');


document.getElementById("send-message").addEventListener('click', () => {
    const message = document.getElementById("message").value;

    const
        body = JSON.stringify({
            message
        });



    const request = new Request(`${server}/send`, {method: 'POST', body});

    fetch(request, {headers: {'Content-Type': 'application/json'}}).then(response => {
        return response.json();
    }).then((data) => {
        document.getElementById("response").innerHTML = data.response;
    });
});

