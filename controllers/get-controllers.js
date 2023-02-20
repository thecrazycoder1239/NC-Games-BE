const { fetchedCategories } = require('../models/get-models');

exports.fetchCategories = (req, res, next) => {
    fetchedCategories().then(categories => {
        res.status(200).send({ categories })
    }).catch(err => {
        next(err);
    }) 
}