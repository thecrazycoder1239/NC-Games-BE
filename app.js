const express = require('express');
const app = express();
const { fetchCategories } = require('./controllers/get-controllers');
const { handles404, handleServerErrors } = require('./error-handlers');

app.use(express.json());

app.get('/api/categories', fetchCategories);

app.get('/*', function (req, res) {
    res.status(404).send({ msg : 'route does not exist'})
})


app.use(handleServerErrors);

module.exports = app;