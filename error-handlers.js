exports.handles404 = (error, req, res, next) => {
 if(error.match(/^\/api\//ig)) {
    res.status(404).send({ msg : 'route does not exist'})
 } else {
    next(error);
 }
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};