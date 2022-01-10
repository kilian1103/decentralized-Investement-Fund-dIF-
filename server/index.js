const express = require('express');
const app = express();
const cors = require('cors');
const port = 3041;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// create bank accounts
const balances = {};
const publicXYKeys  ={};
const privateKeys = {};

for (let i = 0;i < 3; i++){
    const key = ec.genKeyPair();
    const publicX = key.getPublic().x.toString(16);
    const publicY = key.getPublic().y.toString(16);
    const privateKey = key.getPrivate().toString(16);
    const publicKey = key.getPublic().encode('hex')
    balances[publicKey] = (i+1)*75;
    publicXYKeys[publicKey] = [publicX, publicY];
    privateKeys[publicKey] =  privateKey;
}


app.get('/balance/:address', (req, res) => {
    const {address} = req.params;
    const balance = balances[address] || 0;
    res.send({balance});
});

app.post('/send', (req, res) => {
    const {sender, recipient, amount, signature, stringmsgHash} = req.body;


    if (sender in balances){
        const publicKey = {
            x: publicXYKeys[sender][0],
            y: publicXYKeys[sender][1]
        }
        const serverSignature = {
            r: signature.r,
            s: signature.s}

        const serverkey = ec.keyFromPublic(publicKey);
        //verify process
        if(serverkey.verify(stringmsgHash, serverSignature)){
            balances[sender] -= amount;
            balances[recipient] = (balances[recipient] || 0) + +amount;
            console.log("SUCCESS");
            res.send({balance: balances[sender]});
        }
        else{
            console.log("NO PERMISSION FOR THIS ACCOUNT")
        }
    }
    else{
        // anybody can send me money
        if(recipient in balances){
            balances[recipient] = (balances[recipient] || 0) + +amount;
            console.log("SUCCESS");
            res.send({balance: balances[sender]});
        }
        else{
            console.log("SORRY NO ACCOUNT HERE")
        }
    }
});

app.listen(port, () => {

    console.log(`Listening on port ${port}!`);
    console.log('Available accounts: ');
    console.log(balances)
    console.log('Private Keys');
    for (const v of Object.values(privateKeys)){
        console.log(v);
    }

});

