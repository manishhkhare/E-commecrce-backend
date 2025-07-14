const { UnauthorizedError } = require("express-jwt");

function errorhandler(err, res, req, next) {
    if (err.name === UnauthorizedError) {
        res.status(401).send('unauthorizedError');

    }
    if (err.name === ValidationError) {
        res.status(401).send("vailidation error")
    }
    else {
        res.status(500).send('server error');
    }
}