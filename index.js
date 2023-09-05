require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const router = require('./app/router.js');
const cors = require('cors');

app.use(cors('*'));
// pour réagir aux formulaires, on rajoute ce middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(router);


app.set('port', process.env.PORT || 5000);
app.set('base_url', process.env.BASE_URL + ':' + app.get('port'));


app.listen(app.get('port'), () => {
        console.log(`Listening on ${process.env.BASE_URL
    }:${process.env.PORT}`);
});
