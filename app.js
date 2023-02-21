const express = require('express');
const app = express();
const { fetchCategories, fetchReviews, fetchComments } = require('./controllers/get-controllers');
const { handleServerErrors } = require('./error-handlers');

// app.use(express.json());

app.get('/api/categories', fetchCategories);

app.get('/api/reviews', fetchReviews);

app.get('/api/reviews/:review_id/comments', fetchComments)


// make this generic, not just for get method
app.get('/*', function (req, res) {
    res.status(404).send({ msg : 'route does not exist'})
})


app.use(handleServerErrors);

module.exports = app;