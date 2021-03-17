const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const routes = require("./routes/index");
const _ = require("lodash");
const { forOwn, get } = require("lodash");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes );
const PORT = 8000











const reply = (req, res) => {
    res.status(200).send(ecom_purchases(transactions))
}




app.get('/', reply)



app.listen(PORT, function(){
    console.log(`Listening on port: `, PORT)
});