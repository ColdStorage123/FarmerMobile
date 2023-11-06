//for sign up or login post request
// back end to front end get

//err0r => error connectingError: queryTxt EREFUSED cluster0.gfpscra.mongodb.net
//solution : add ip address
//encrypting user password before saving to database using bycript in user .js
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
require('./db');
require('./models/User');
require('./models/ColdStorage');
const authRoutes = require('./routes/authRoutes');
const requireToken = require('./Middlewares/AuthTokenRequired');
//adding 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to handle URL-encoded data
//ending
app.use(bodyParser.json());
app.use(authRoutes);

app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
    //res.send("  This is home page");
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
