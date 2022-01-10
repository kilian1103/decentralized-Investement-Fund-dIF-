const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());



app.post('/send', (req, res) => {
    const {message} = req.body;

    res.send({response: ["WAS LOS AMK"]});

});

app.listen(port, () => {

    console.log(`Listening on port ${port}!`);


});

