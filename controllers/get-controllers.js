const { fetchedCategories, fetchedReviews, fetchedReview } = require('../models/get-models');

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

exports.fetchReview = (req, res, next) => {
    const { review_id } = req.params;
    fetchedReview( review_id ).then(review => {
        res.status(200).send({ review });
    }).catch(err => {
        next(err);
    })
}