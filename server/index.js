const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());


app.post('/send', (req, res) => {
    const {message} = req.body;

    res.send({response: ["HI"]});

});

app.listen(port, () => {

    console.log(`Listening on port ${port}!`);


});

