const { fetchedCategories, fetchedReviews, fetchedComments } = require('../models/get-models');

exports.fetchCategories = (req, res, next) => {
    fetchedCategories().then(categories => {
        res.status(200).send({ categories });
    }).catch(err => {
        next(err);
    }) 
}

exports.fetchReviews = (req, res, next) => {
    fetchedReviews().then(reviews => {
        res.status(200).send({ reviews });
    }).catch(err => {
        next(err);
    })
}

exports.fetchComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchedComments(review_id).then(comments => {
        res.status(200).send({ comments })
    }).catch(err => {
        next(err);
    })
}