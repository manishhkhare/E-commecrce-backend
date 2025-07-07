function errorhandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized access. Invalid or missing token.' });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }

    // Default to 500 server error
    return res.status(500).json({ message: 'Internal Server Error' });
}
