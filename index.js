require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const router = require('./app/router');

app.use(cors('*'));
app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(router);

app.set('port', process.env.PORT || 5000);
app.set('base_url', `${process.env.BASE_URL}:${app.get('port')}`);

app.listen(app.get('port'), () => {
  console.log(`Listening on ${process.env.BASE_URL
  }:${process.env.PORT}`);
});
