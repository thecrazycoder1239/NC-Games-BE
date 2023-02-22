exports.handlesInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: 'path not found'});
}

exports.handlesCustom404Errors = (err, req, res, next) => {
    if(err === 'review not found') {
        res.status(404).send({ msg: 'review not found'})
    }
    next(err);
}

exports.handles400Errors = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({ msg: 'invalid input'})
    }
    next(err);
}

exports.handlesServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};