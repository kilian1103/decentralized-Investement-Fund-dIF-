import "./index.scss";

const server = "http://localhost:3042";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

document.getElementById("exchange-address").addEventListener('input', ({target: {value}}) => {
    if (value === "") {
        document.getElementById("balance").innerHTML = 0;
        return;
    }

    fetch(`${server}/balance/${value}`).then((response) => {
        return response.json();
    }).then(({balance}) => {
        document.getElementById("balance").innerHTML = balance;
    });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
    const sender = document.getElementById("exchange-address").value;
    const amount = document.getElementById("send-amount").value;
    const recipient = document.getElementById("recipient").value;
    const privatekey = document.getElementById("privatekey").value;

    // signing process
    const key = ec.keyFromPrivate(privatekey.toString());

    const message = "Send " + recipient + " " + amount + " by " + sender
    const msgHash = SHA256(message);
    const stringmsgHash = msgHash.toString();
    const signature = key.sign(msgHash.toString());

    const
        body = JSON.stringify({
            sender, amount, recipient, signature, stringmsgHash
        });

    const request = new Request(`${server}/send`, {method: 'POST', body});

    fetch(request, {headers: {'Content-Type': 'application/json'}}).then(response => {
        return response.json();
    }).then(({balance}) => {
        document.getElementById("balance").innerHTML = balance;
    });
});

