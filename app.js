const express = require('express');
const app = express();
const { fetchCategories, fetchReviews } = require('./controllers/get-controllers');
const { handleServerErrors } = require('./error-handlers');

app.use(express.json());

app.get('/api/categories', fetchCategories);

app.get('/api/reviews', fetchReviews)

app.get('/*', function (req, res) {
    res.status(404).send({ msg : 'route does not exist'})
})


app.use(handleServerErrors);

module.exports = app;