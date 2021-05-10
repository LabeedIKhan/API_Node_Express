const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const bodyParser = require('body-parser');
const postRoute = require('./routes/posts');


dotenv.config();

app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(

    process.env.DB_CONNECTION,
    {  useUnifiedTopology : true, useNewUrlParser: true},
    () => console.log("Connected to Database")
); 


app.use('/api/user', authRoute);
app.use('/api/post', postRoute);

app.listen(3000, console.log("Server Up and Running!"));




