const { fetchedCategories, fetchedReviews } = require('../models/get-models');

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